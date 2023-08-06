const os = require("os");
const ip = require("ip");
const useragent = require("useragent");
const logger = require("./logger");

// ANSI escape sequences for color formatting
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

function requestLogger(req, res, next) {
  // Log the request body
  const requestBody = JSON.stringify(req.body, null, 2);
  const hiddenPasswordBody = hidePassword(requestBody);
  console.log("------------------------------------------------------");
  console.log("------------------- New Request ----------------------");
  console.log("------------------------------------------------------");
  logger.info(
    `Request Body: ${colors.fgYellow}${hiddenPasswordBody}${colors.reset}`
  );

  // Log CPU and RAM usage
  const cpuUsage = process.cpuUsage();
  const memoryUsage = process.memoryUsage();
  logger.info(
    `CPU Usage: ${colors.fgGreen}${formatCpuUsage(cpuUsage)}${colors.reset}`
  );
  logger.info(
    `RAM Usage: ${colors.fgGreen}${formatMemoryUsage(memoryUsage)}${
      colors.reset
    }`
  );

  // Log user IP address and MAC address
  const ipAddress = getClientIP(req);
  const macAddress = getMacAddress();
  logger.info(`User IP Address: ${colors.fgCyan}${ipAddress}${colors.reset}`);
  logger.info(`User MAC Address: ${colors.fgCyan}${macAddress}${colors.reset}`);

  // Parse and log device information
  const userAgent = useragent.parse(req.headers["user-agent"]);
  const device = {
    model: userAgent.device.toString(),
    os: userAgent.os.toString(),
    browser: userAgent.toAgent(),
  };
  logger.info(
    `Device Information: ${colors.fgMagenta}${JSON.stringify(device)}${
      colors.reset
    }`
  );

  // Log request URL, method, headers, and query parameters
  logger.info(`Request URL: ${colors.fgBlue}${req.url}${colors.reset}`);
  logger.info(`Request Method: ${colors.fgBlue}${req.method}${colors.reset}`);
  logger.info(
    `Request Headers: ${colors.fgYellow}${JSON.stringify(req.headers)}${
      colors.reset
    }`
  );
  logger.info(
    `Query Parameters: ${colors.fgYellow}${JSON.stringify(req.query)}${
      colors.reset
    }`
  );

  // Log response status code and response time
  res.on("finish", () => {
    logger.info(
      `Response Status Code: ${colors.fgCyan}${res.statusCode}${colors.reset}`
    );
    logger.info(
      `Response Time: ${colors.fgGreen}${Date.now() - res.locals.startTime}ms${
        colors.reset
      }`
    );
  });

  // Store start time for calculating response time
  res.locals.startTime = Date.now();

  next(); // Call the next middleware or route handler
}

// Function to replace the password value in the request body with asterisks
function hidePassword(body) {
  const requestBody = JSON.parse(body);
  if (requestBody.password) {
    requestBody.password = "****";
  }
  return JSON.stringify(requestBody, null, 2);
}

// Function to format CPU usage as human-readable string
function formatCpuUsage(cpuUsage) {
  const user = formatTime(cpuUsage.user);
  const system = formatTime(cpuUsage.system);
  return `User: ${user}, System: ${system}`;
}

// Function to format memory usage as human-readable string
function formatMemoryUsage(memoryUsage) {
  const rss = formatBytes(memoryUsage.rss);
  const heapTotal = formatBytes(memoryUsage.heapTotal);
  const heapUsed = formatBytes(memoryUsage.heapUsed);
  return `RSS: ${rss}, Heap Total: ${heapTotal}, Heap Used: ${heapUsed}`;
}

// Function to format time in microseconds as human-readable string
function formatTime(microseconds) {
  const milliseconds = Math.floor(microseconds / 1000);
  return `${milliseconds} ms`;
}

// Function to format bytes as human-readable string
function formatBytes(bytes) {
  const kilobytes = Math.floor(bytes / 1024);
  return `${kilobytes} KB`;
}

// Function to retrieve the client's IP address
function getClientIP(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = forwardedFor.split(",");
    return ips[0].trim();
  }
  return req.connection.remoteAddress;
}

// Function to retrieve the MAC address
function getMacAddress() {
  const networkInterfaces = os.networkInterfaces();
  const interfaceKeys = Object.keys(networkInterfaces);
  for (const key of interfaceKeys) {
    const networkInterface = networkInterfaces[key];
    const macAddressInfo = networkInterface.find(
      (info) => info.mac !== "00:00:00:00:00:00" && !info.internal
    );
    if (macAddressInfo) {
      return macAddressInfo.mac;
    }
  }
  return "Unknown";
}

module.exports = requestLogger;
