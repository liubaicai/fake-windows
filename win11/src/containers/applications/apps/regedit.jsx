import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/regedit.scss";

// Simulated registry data structure matching the screenshot
const registryData = {
  name: "计算机",
  icon: "computer",
  children: [
    {
      name: "HKEY_CLASSES_ROOT",
      children: [],
    },
    {
      name: "HKEY_CURRENT_USER",
      children: [],
    },
    {
      name: "HKEY_LOCAL_MACHINE",
      children: [
        { name: "BCD00000000", children: [] },
        { name: "HARDWARE", children: [] },
        { name: "SAM", children: [] },
        { name: "SECURITY", children: [] },
        { name: "SOFTWARE", children: [] },
        {
          name: "SYSTEM",
          children: [
            { name: "ActivationBroker", children: [] },
            { name: "ControlSet001", children: [] },
            { name: "CurrentControlSet", children: [] },
            { name: "DriverDatabase", children: [] },
            {
              name: "HardwareConfig",
              children: [],
              values: [
                {
                  name: "(默认)",
                  type: "REG_SZ",
                  data: "(数值未设置)",
                  icon: "str",
                },
                {
                  name: "LastConfig",
                  type: "REG_SZ",
                  data: "{1abbe291-3c03-4502-9e9c-5f9fbd7ad6e6}",
                  icon: "str",
                },
                {
                  name: "LastId",
                  type: "REG_DWORD",
                  data: "0x00000000 (0)",
                  icon: "bin",
                },
              ],
            },
            { name: "Input", children: [] },
            { name: "Keyboard Layout", children: [] },
            { name: "Maps", children: [] },
            { name: "MountedDevices", children: [] },
            { name: "ResourceManager", children: [] },
            { name: "ResourcePolicyStore", children: [] },
            { name: "RNG", children: [] },
            { name: "Select", children: [] },
            { name: "Setup", children: [] },
            { name: "Software", children: [] },
            { name: "State", children: [] },
            { name: "WaaS", children: [] },
            { name: "WPA", children: [] },
          ],
        },
      ],
    },
    {
      name: "HKEY_USERS",
      children: [],
    },
    {
      name: "HKEY_CURRENT_CONFIG",
      children: [],
    },
  ],
};

const defaultValues = [
  { name: "(默认)", type: "REG_SZ", data: "(数值未设置)", icon: "str" },
];

// SVG icons for the tree and value list
const FolderIcon = ({ open }) => (
  <svg className="folder-icon" viewBox="0 0 16 16">
    {open ? (
      <>
        <path d="M1 3h5l1 1h7v1H7L6 4H2v8l1.5-5h12L13.5 13H1V3z" fill="#dcb67a" />
        <path d="M3.5 7l-1.5 5h10l2-5H3.5z" fill="#f5d78e" />
      </>
    ) : (
      <>
        <path d="M1 3v10h13V5H7L6 4H1z" fill="#dcb67a" />
        <path d="M1 5h13v8H1z" fill="#f5d78e" />
      </>
    )}
  </svg>
);

const ComputerIcon = () => (
  <svg className="folder-icon" viewBox="0 0 16 16">
    <rect x="1" y="2" width="14" height="9" rx="1" fill="#6b9ed6" />
    <rect x="2" y="3" width="12" height="7" fill="#a4d4ff" />
    <rect x="5" y="12" width="6" height="1" fill="#888" />
    <rect x="4" y="13" width="8" height="1" rx="0.5" fill="#888" />
  </svg>
);

const StringIcon = () => (
  <svg className="val-icon" viewBox="0 0 16 16">
    <rect x="0" y="1" width="16" height="14" rx="1" fill="#c4dcf3" stroke="#7ba1c9" strokeWidth="0.5" />
    <text x="3" y="11" fontSize="8" fontFamily="serif" fill="#0033a0" fontWeight="bold">ab</text>
  </svg>
);

const BinaryIcon = () => (
  <svg className="val-icon" viewBox="0 0 16 16">
    <rect x="0" y="1" width="16" height="14" rx="1" fill="#c4dcf3" stroke="#7ba1c9" strokeWidth="0.5" />
    <text x="1" y="11" fontSize="7" fontFamily="monospace" fill="#0033a0" fontWeight="bold">011</text>
  </svg>
);

const ValueIcon = ({ type }) => {
  if (type === "REG_DWORD" || type === "REG_QWORD" || type === "REG_BINARY") {
    return <BinaryIcon />;
  }
  return <StringIcon />;
};

// Build path from node hierarchy
const getNodePath = (node, path = []) => {
  return [...path, node.name].join("\\");
};

const TreeNode = ({
  node,
  level = 0,
  selectedPath,
  onSelect,
  defaultExpanded,
  parentPath = [],
}) => {
  const [expanded, setExpanded] = useState(
    defaultExpanded ? defaultExpanded.includes(node.name) : false,
  );
  const currentPath = [...parentPath, node.name];
  const pathStr = currentPath.join("\\");
  const isSelected = selectedPath === pathStr;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    onSelect(pathStr, node);
    if (!expanded && hasChildren) {
      setExpanded(true);
    }
  };

  return (
    <div className="reg-tree-node">
      <div
        className={`reg-tree-label ${isSelected ? "selected" : ""}`}
        onClick={handleSelect}
      >
        <span className="toggle-icon" onClick={handleToggle}>
          {hasChildren ? (expanded ? "▾" : "▸") : ""}
        </span>
        {node.icon === "computer" ? (
          <ComputerIcon />
        ) : (
          <FolderIcon open={expanded && hasChildren} />
        )}
        <span className="node-name">{node.name}</span>
      </div>
      {expanded && hasChildren && (
        <div className="reg-tree-children">
          {node.children.map((child, i) => (
            <TreeNode
              key={i}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              defaultExpanded={defaultExpanded}
              parentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Regedit = () => {
  const wnapp = useSelector((state) => state.apps.reg);
  const [selectedPath, setSelectedPath] = useState(
    "计算机\\HKEY_LOCAL_MACHINE\\SYSTEM\\HardwareConfig",
  );
  const [selectedNode, setSelectedNode] = useState(
    registryData.children[2].children[5].children[4],
  );
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelect = (path, node) => {
    setSelectedPath(path);
    setSelectedNode(node);
    setSelectedValue(null);
  };

  const values = selectedNode?.values || defaultValues;

  return (
    <div
      className="regeditApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="注册表编辑器"
      />
      <div className="windowScreen flex flex-col">
        {/* Menu bar */}
        <div className="regedit-menubar">
          <div className="menu-item">
            文件(<span className="underline">F</span>)
          </div>
          <div className="menu-item">
            编辑(<span className="underline">E</span>)
          </div>
          <div className="menu-item">
            查看(<span className="underline">V</span>)
          </div>
          <div className="menu-item">
            收藏夹(<span className="underline">A</span>)
          </div>
          <div className="menu-item">
            帮助(<span className="underline">H</span>)
          </div>
        </div>

        {/* Address bar */}
        <div className="regedit-addressbar">
          <span className="addr-label">计算机\</span>
          <input
            className="addr-input"
            type="text"
            value={
              selectedPath.startsWith("计算机\\")
                ? selectedPath.slice(4)
                : selectedPath
            }
            readOnly
          />
        </div>

        {/* Main body: tree + values */}
        <div className="regedit-body">
          {/* Tree pane */}
          <div className="regedit-tree">
            <TreeNode
              node={registryData}
              selectedPath={selectedPath}
              onSelect={handleSelect}
              defaultExpanded={[
                "计算机",
                "HKEY_LOCAL_MACHINE",
                "SYSTEM",
              ]}
              parentPath={[]}
            />
          </div>

          {/* Value list pane */}
          <div className="regedit-values">
            <div className="regedit-values-header">
              <div className="col-header col-name">名称</div>
              <div className="col-header col-type">类型</div>
              <div className="col-header col-data">数据</div>
            </div>
            <div className="regedit-values-body">
              {values.map((val, i) => (
                <div
                  key={i}
                  className={`value-row ${selectedValue === i ? "selected" : ""}`}
                  onClick={() => setSelectedValue(i)}
                >
                  <div className="value-cell col-name">
                    <ValueIcon type={val.type} />
                    {val.name}
                  </div>
                  <div className="value-cell col-type">{val.type}</div>
                  <div className="value-cell col-data">{val.data}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="regedit-statusbar">
          <span>{selectedPath}</span>
        </div>
      </div>
    </div>
  );
};
