import { useContext, useState } from "react";
import {
  AiOutlineBarChart,
  AiOutlineDown,
  AiOutlineMenu,
  AiOutlineTransaction,
  AiOutlineUp,
} from "react-icons/ai";
import { BsJournalCheck, BsLightbulb } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbSubtask, TbUsers } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useContext(AuthContext);
  const menu = [
    {
      id: 1,
      name: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      path: "/",
      subMenu: [],
    },
    {
      id: 2,
      name: "Chart of Accounts",
      icon: <AiOutlineBarChart />,
      path: "/chart-of-accounts",
      subMenu: [
        {
          id: 21,
          name: "Account Type",
          icon: <TbSubtask />,
          path: "/chart-of-accounts/account-type",
        },
        {
          id: 22,
          name: "Account Sub-Type",
          icon: <TbSubtask />,
          path: "/chart-of-accounts/account-sub-type",
        },
      ],
    },

    {
      id: 3,
      name: "Transactions",
      icon: <AiOutlineTransaction />,
      path: "/transactions",
      subMenu: [],
    },
    {
      id: 4,
      name: "Journal Entry",
      icon: <BsJournalCheck />,
      path: "/journal-entries",
      subMenu: [],
    },
    {
      id: 5,
      name: "Reports",
      icon: <HiOutlineDocumentReport />,
      path: "/reports",
      subMenu: [
        {
          id: 51,
          name: "Income/Expense",
          icon: <TbSubtask />,
          path: "/reports/income-expense",
        },
        {
          id: 52,
          name: "Ledger",
          icon: <TbSubtask />,
          path: "/reports/ledger",
        },
        {
          id: 53,
          name: "Received - Paid",
          icon: <TbSubtask />,
          path: "/reports/received-paid",
        },
      ],
    },
    {
      id: 6,
      name: "User Management",
      icon: <TbUsers />,
      path: "/user-management",
      subMenu: [],
    },
    {
      id: 7,
      name: "User Guide",
      icon: <BsLightbulb />,
      path: "/user-guide",
      subMenu: [],
    },
    // {
    //   id: 8,
    //   name: "Documentation",
    //   icon: <HiOutlineDocumentText />,
    //   path: "/documentation",
    //   subMenu: [],
    // },
  ];
  const [isSelected, setIsSelected] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState({});
  const [clickedSubMenu, setClickedSubMenu] = useState({});
  const [isExpandMenu, setIsExpandMenu] = useState(true); // Set the initial value to true for the sidebar to be expanded
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State variable to control sidebar visibility on smaller screens

  //
  const handleMenuClick = (id) => {
    const selectedItem = menu.find((item) => item.id === id);
    setIsSelected(selectedItem);
    // setIsSidebarVisible(false)
  };
  const handleSubMenuClick = (id) => {
    const foundSubMenu = menu.map((m) => m.subMenu.find((sm) => sm.id === id));
    setClickedSubMenu(foundSubMenu.filter((submenu) => submenu !== undefined));
  };
  const handleUpDownArrowClick = (menuId) => {
    // console.log(menuId);
    const selectedItem = menu.find((item) => item.id === menuId);

    setSelectedSubMenu(menu.find((item) => item.id === menuId));
    setIsExpandMenu(selectedItem.id === menuId && !isExpandMenu);
  };
  // console.log(isExpandMenu);
  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  // console.log('current path: ',currentPath)

  return (
    <>
      {/* desktop */}
      <div className="md:block hidden">
        <div
          className={`h-[calc(100vh-64px)] max-w-[300px] min-w-[260px]  bg-white print:hidden }`}
        >
          <div className="">
            <ul className="pt-7">
              {menu.map((item, i) => (
                <div key={i}>
                  {/* main menu */}
                  <li
                    onClick={() => {
                      handleMenuClick(item.id);
                      handleUpDownArrowClick(item.id);
                    }}
                    className={`flex w-full items-center text-lg font-[400] py-2 hover:bg-primary-100 hover:text-white cursor-pointer ${
                      item.subMenu.findIndex(
                        (itm) => itm.path === currentPath
                      ) > -1 || item.path === currentPath
                        ? "bg-primary-300 hover:bg-primary-200 text-white"
                        : ""
                    }`}
                  >
                    <Link to={item.path} className="w-full">
                      <div className="px-3 w-full">
                        <div className="flex w-full justify-between  items-center">
                          <div className="flex items-center gap-3">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                          {item.subMenu && item.subMenu.length > 0 && (
                            <div
                              className="flex justify-end"
                              onClick={(e) => {
                                handleUpDownArrowClick(item.id);
                              }}
                            >
                              {isExpandMenu &&
                              selectedSubMenu &&
                              selectedSubMenu.id === item.id ? (
                                <AiOutlineUp />
                              ) : (
                                <AiOutlineDown />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                  {/* submenu */}
                  <li className="bg-slate-100">
                    {(item.subMenu.findIndex(
                      (itm) => itm.path === currentPath
                    ) > -1 ||
                      item.path === currentPath) &&
                      isExpandMenu && (
                        <ul
                          className={` transition-all duration-1000 max-h-96 opacity-100}`}
                        >
                          {item.subMenu.map((subMenu, index) => (
                            <li
                              onClick={() => handleSubMenuClick(subMenu.id)}
                              key={index}
                              className={`p-1 pl-6 hover:bg-primary-100 hover:text-white  ${
                                currentPath === subMenu.path
                                  ? "bg-primary-200 text-white"
                                  : ""
                              }`}
                            >
                              <Link
                                to={subMenu.path}
                                className={`flex gap-3 items-center`}
                              >
                                <span>{subMenu.icon}</span>
                                <div className="">{subMenu.name}</div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="md:hidden block">
        <div
          className={`md:h-[calc(100vh-64px)] h-[calc(100vh-48px)] w-[230px]  bg-white print:hidden transition-all duration-500 ease-in-out ${
            isSidebarVisible ? "absolute left-0 " : " absolute -left-[250px]"
          }`}
        >
          <div className="">
            <ul className="pt-7">
              {menu.map((item, i) => (
                <div key={i}>
                  {/* main menu */}
                  <li
                    onClick={() => {
                      handleMenuClick(item.id);
                      handleUpDownArrowClick(item.id);
                    }}
                    className={`flex w-full items-center text-base font-[400] py-2 hover:bg-primary-100 hover:text-white cursor-pointer ${
                      isSelected?.id === item?.id || currentPath === item.path
                        ? "bg-primary-300 hover:bg-primary-200 text-white"
                        : ""
                    }`}
                  >
                    <Link to={item.path} className="w-full">
                      <div className="px-3 w-full">
                        <div className="flex w-full justify-between  items-center">
                          {/* icon and menu */}
                          <div className="flex items-center gap-3">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                          {item.subMenu && item.subMenu.length > 0 && (
                            // up/down arrow
                            <div
                              className="flex justify-end"
                              onClick={() => handleUpDownArrowClick(item.id)}
                            >
                              {isExpandMenu &&
                              selectedSubMenu &&
                              selectedSubMenu.id === item.id ? (
                                <AiOutlineUp />
                              ) : (
                                <AiOutlineDown />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                  {/* submenu */}
                  <li className="bg-slate-100">
                    {isExpandMenu &&
                      selectedSubMenu &&
                      selectedSubMenu.id === item.id && (
                        <ul
                          className={` transition-all duration-1000 ${
                            isExpandMenu && selectedSubMenu === item.id
                              ? "max-h-0 opacity-0"
                              : "max-h-96 opacity-100"
                          }`}
                        >
                          {item.subMenu.map((subMenu, i) => (
                            <li
                              onClick={() => handleSubMenuClick(subMenu.id)}
                              key={i}
                              className={`p-1 pl-6 hover:bg-primary-100 hover:text-white  ${
                                clickedSubMenu[0]?.id === subMenu?.id
                                  ? "bg-primary-200 text-white"
                                  : ""
                              }`}
                            >
                              <Link
                                to={subMenu.path}
                                className={`flex gap-3 items-center`}
                              >
                                <span>{subMenu.icon}</span>
                                <div className="">{subMenu.name}</div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                </div>
              ))}
              <div className="flex justify-center mt-3">
                <button
                  onClick={logout}
                  className="bg-primary-300 py-1 px-3 rounded-sm text-white"
                >
                  {user ? "Logout" : "Login"}
                </button>
              </div>
            </ul>
          </div>
          {/* Sidebar toggle button */}
          <button
            className="text-lg fixed -top-2 -left-2 m-4 rounded p-2"
            onClick={handleSidebarToggle}
          >
            {isSidebarVisible ? <GrClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
