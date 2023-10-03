import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ContainerOutlined, DashboardOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined, MenuOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';
import {MdOutlineFastfood, MdCheckCircleOutline, MdOutlineCheck} from "react-icons/md";

import {Button, Menu, Switch} from 'antd';
import AccountCreationForm from "../AccountCreationForm";
import './custom-theme.css'
import {Link, Route} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const { SubMenu } = Menu;

function getItem(
    label,
    key,
    icon,
    children,
    type
) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem('Dashboard', '1', <DashboardOutlined />),
    getItem('Food Entries', '2', <MdOutlineFastfood/>),
    getItem('Exercise Entries', '3', <MdOutlineCheck/>),
    getItem('Goals', '4', <MdCheckCircleOutline />),
    getItem('Help', '5', <QuestionCircleOutlined />),


];

function SideDrawer() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                >
                    <Button type="primary"  onClick={toggleCollapsed} style={{ marginBottom: 16, backgroundColor: "#c1a467" }}>
                        {collapsed ? <MenuOutlined  /> : <MenuOutlined />}
                    </Button>


                    {items.map((item) => (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={`/${item.label.toLowerCase().replace(' ', '-')}`}>
                                {item.label}
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu>


    {/* Define your routes here */}
    <Switch>
        {items.map((item) => (
            <Route key={item.key} path={`/${item.label.toLowerCase().replace(' ', '-')}`}>
                {/* Render the component for the corresponding route */}
                {/* For example: */}
                <div>{item.label} Content</div>
            </Route>
        ))}
    </Switch>
        </div>
    );
}

export default SideDrawer;
