import React, { useEffect, useState } from "react";
import { Menu, Switch } from "antd";
import axios from "axios";

const DynamicMenu = () => {
  const [menuData, setMenuData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [current, setCurrent] = useState("");

  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

  const fetchMenuTree = async (accessToken) => {
    try {
      const response = await axios.get("http://appnox-tm.it/api/v1/menu/tree", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("API fetching failed!:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const menuResponse = await fetchMenuTree(accessToken);
        setMenuData(menuResponse.result.data);
        setLoading(false);
      } catch (error) {
        console.error("fetching menu data failed!:", error);
      }
    };

    fetchMenuData();
  }, []);

  const transformMenuData = (data) => {
    if (!data) return [];

    return data.map((item) => {
      const transformedItem = {
        key: item.menuId.toString(),
        label: item.item,
        children:
          item.children && item.children.length
            ? transformMenuData(item.children)
            : null,
      };
      return transformedItem;
    });
  };

  const items = transformMenuData(menuData);

  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      {loading ? (
        <p className="text-2xl">Loading...</p>
      ) : (
        <div>
          <Switch
            checked={theme === "dark"}
            onChange={changeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
          <br />
          <br />
          <Menu
            theme={theme}
            onClick={onClick}
            style={{
              width: 256,
            }}
            selectedKeys={[current]}
            mode="inline"
            items={items}
          />
        </div>
      )}
    </>
  );
};

export default DynamicMenu;
