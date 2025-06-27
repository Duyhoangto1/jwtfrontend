import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

import "./Roles.scss";
import {
  assignRoleToGroup,
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../../../services/roleService";
import { getGroup } from "../../../services/groupService";
import { PlusCircle } from "lucide-react";

const { Item } = Form;
const { Option } = Select;

const Roles = () => {
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]); // State để lưu danh sách group
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
    fetchGroups(); // Lấy danh sách group khi component mount
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await getRoles();
      console.log("API Response (getRoles):", response);

      setRoles(response.DT);
    } catch (error) {
      message.error("Error fetching roles");
      console.error("Error in fetchRoles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await getGroup();

      setGroups(response.DT);
    } catch (error) {
      message.error("Error fetching groups");
      console.error("Error in fetchGroups:", error);
    }
  };

  const showModal = (role = null) => {
    setSelectedRole(role);
    form.setFieldsValue(role || { url: "", description: "", groupId: null });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);
      if (selectedRole) {
        const response = await updateRole(
          selectedRole.id,
          values.url,
          values.description
        );

        if (values.groupId) {
          const assignResponse = await assignRoleToGroup(
            selectedRole.id,
            values.groupId
          );

          message.success("Role updated and assigned to group successfully");

          message.warning(
            "Role updated, but failed to assign to group: " + assignResponse.EM
          );

          fetchRoles();
        }
      } else {
        const response = await createRole(values.url, values.description);

        if (values.groupId) {
          const assignResponse = await assignRoleToGroup(
            response.DT.id,
            values.groupId
          );

          message.success("Role created and assigned to group successfully");

          fetchRoles();
        }
      }
    } catch (error) {
      message.error("Failed to save role");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRole(null);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const response = await deleteRole(id);

      message.success("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      message.error("Failed to delete role");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "URL", dataIndex: "url", key: "url" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Assigned Group",
      dataIndex: "group",
      key: "group",
      render: (text, record) => record.Group_Roles?.[0]?.Group?.name || "None",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="roles-container">
      <h1>Roles Management</h1>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        {<PlusCircle />}
        Add Role
      </Button>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
      <Modal
        title={selectedRole ? "Edit Role" : "Add Role"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Item
            name="url"
            label="URL"
            rules={[{ required: true, message: "Please input URL!" }]}
          >
            <Input />
          </Item>
          <Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input />
          </Item>
          <Item
            name="groupId"
            label="Assign to Group"
            rules={[{ required: false }]}
          >
            <Select placeholder="Select a group" allowClear>
              {groups.map((group) => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;
