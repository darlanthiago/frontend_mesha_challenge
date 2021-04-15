import { useEffect, useState } from "react";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

import { Link } from "react-router-dom";

import { FaRegChartBar, FaHome, FaUsersCog } from "react-icons/fa";

import { FiLogOut } from "react-icons/fi";

import { RiServiceFill } from "react-icons/ri";

//contexts
import { useReactAuth } from "../../../contexts/hooks/AuthContext";

//assets
import Logo from "../../../assets/logo.svg";
import { Image } from "react-bootstrap";

const Aside = ({ image, collapsed, rtl, toggled, handleToggleSidebar }) => {
  const { user, signOut } = useReactAuth();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    user.profile === "admin" ? setIsAdmin(true) : setIsAdmin(false);
  }, [user.profile]);

  function handleSignOut() {
    signOut();
  }

  return (
    <ProSidebar
      image={image}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <img src={Logo} alt="Logo" width="140" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="round">
          <MenuItem icon={<FaHome />}>
            Home
            <Link to="/" />
          </MenuItem>
          <MenuItem icon={<FaRegChartBar />}>
            Dashboard
            <Link to="/dashboard" />
          </MenuItem>

          <SubMenu
            icon={<FaUsersCog />}
            title="Usuários"
            className={!isAdmin && "hidden"}
          >
            <MenuItem className={!isAdmin && "hidden"}>
              Listar
              <Link to="/user" />
            </MenuItem>

            <MenuItem className={!isAdmin && "hidden"}>
              Criar Novo
              <Link to="/user-create" />
            </MenuItem>
          </SubMenu>

          <SubMenu
            icon={<RiServiceFill />}
            title="Serviços"
            className={!isAdmin && "hidden"}
          >
            <MenuItem className={!isAdmin && "hidden"}>
              Listar
              <Link to="/service" />
            </MenuItem>

            <MenuItem className={!isAdmin && "hidden"}>
              Criar Novo
              <Link to="/service-create" />
            </MenuItem>
          </SubMenu>
        </Menu>

        <Menu iconShape="round">
          <SubMenu
            title={`Olá, ${user.name}`}
            icon={<Image src={user.avatar_url} rounded height="40" />}
          >
            <MenuItem>
              Perfil
              <Link to="/profile" />
            </MenuItem>
          </SubMenu>
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: "center" }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: "20px 24px",
          }}
        >
          <button className="sidebar-btn" onClick={handleSignOut}>
            <FiLogOut />
            <span>Sair</span>
          </button>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Aside;
