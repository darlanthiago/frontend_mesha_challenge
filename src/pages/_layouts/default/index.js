import { useState } from "react";
import Aside from "./Aside";
import { Wrapper } from "./styles";

import { FaBars } from "react-icons/fa";

export default function DefaultLayout({ children }) {
  const [collapsed] = useState(false);
  const [image] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <Wrapper>
      <div className={`app ${toggled ? "toggled" : ""}`}>
        <Aside
          image={image}
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
        />

        <main>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "baseline",
            }}
          >
            <div
              className="btn-toggle"
              onClick={() => handleToggleSidebar(true)}
            >
              <FaBars />
            </div>
          </div>

          <div className="container-fluid">
            <div className="mt-4">{children}</div>
          </div>
        </main>
      </div>
    </Wrapper>
  );
}
