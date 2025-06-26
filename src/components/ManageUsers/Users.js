import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
  getListUser,
  getDetailUser,
  updateUser,
  deleteUser,
  createUser,
} from "../../services/userService";
import { getGroup } from "../../services/groupService";
import "./Users.scss";

const { Option } = Select;

const Users = () => {
  const history = useHistory();
  const user = useSelector((state) => state.user.account);
  const [users, setUsers] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [groups, setGroups] = useState([]); // State để lưu danh sách nhóm

  const fetchUsers = async () => {
    try {
      const response = await getListUser();
      console.log("API Response (getListUser):", response);
      if (response && response.EC === "0" && Array.isArray(response.DT)) {
        setUsers(response.DT);
      } else {
        message.error("Failed to load users: Invalid response");
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      message.error("Error fetching users");
      setUsers([]);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await getGroup();
      console.log("API Response (getGroup):", response);
      setGroups(response.DT); // Lưu danh sách nhóm
    } catch (err) {
      console.error("Error fetching groups:", err);
      message.error("Failed to load groups");
    }
  };

  useEffect(() => {
    if (!user || !user.isAuthenticated) {
      history.push("/login");
      return;
    }
    fetchUsers();
    fetchGroups(); // Gọi API lấy nhóm khi component mount
  }, [user]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
            type="default"
          >
            View Detail
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => showUpdateModal(record)}
            type="primary"
          >
            Update
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record)}
            type="danger"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const showViewModal = async (record) => {
    try {
      console.log("Fetching detail for id:", record.id);
      const response = await getDetailUser(record.id);
      console.log("check view detail", response);
      if (response && response.EC === "0") {
        setSelectedUser(response.DT);
        setIsViewModalVisible(true);
      } else {
        message.error(response.EM || "Failed to load user detail");
      }
    } catch (err) {
      console.error("Error fetching user detail:", err);
      message.error("Failed to load user detail");
    }
  };

  const showUpdateModal = async (record) => {
    try {
      console.log("Fetching detail for update id:", record.id);
      const response = await getDetailUser(record.id);
      if (response && response.EC === "0") {
        setSelectedUser(response.DT);
        setIsUpdateModalVisible(true);
      } else {
        message.error(response.EM || "Failed to load user detail for update");
      }
    } catch (err) {
      console.error("Error fetching user detail for update:", err);
      message.error("Failed to load user detail for update");
    }
  };

  const showDeleteModal = (record) => {
    setSelectedUser(record);
    setIsDeleteModalVisible(true);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCancel = () => {
    setIsViewModalVisible(false);
    setIsUpdateModalVisible(false);
    setIsDeleteModalVisible(false);
    setIsCreateModalVisible(false);
    setSelectedUser(null);
  };

  const handleUpdate = async (values) => {
    try {
      const response = await updateUser(
        selectedUser.id,
        values.username,
        values.email,
        values.phone,
        values.address,
        values.sex,
        values.groupId
      );
      console.log("check update", response);
      if (response.EC === "0") {
        message.success("User updated successfully");
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...values } : user
          )
        );
      } else {
        message.error(response.EM || "Update failed");
      }
      handleCancel();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteUser(selectedUser.id);
      console.log("check delete", response);
      if (response.EC === "0") {
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        message.success("User deleted successfully");
      } else {
        message.error(response.EM || "Delete failed");
      }
      handleCancel();
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Failed to delete user");
    }
  };

  const handleCreate = async (values) => {
    try {
      console.log("Create values:", values);
      const response = await createUser(
        values.email,
        values.phone,
        values.username,
        values.password,
        values.sex,
        values.address,
        values.groupId
      );
      console.log("check create", response);

      message.success("User created successfully");
      fetchUsers();

      handleCancel();
    } catch (err) {
      console.error("Create error:", err);
      message.error("Failed to create user");
    }
  };

  const ViewModal = () => (
    <Modal
      title="User Detail"
      visible={isViewModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>,
      ]}
    >
      <p>
        <strong>ID:</strong> {selectedUser?.id}
      </p>
      <p>
        <strong>Username:</strong> {selectedUser?.username}
      </p>
      <p>
        <strong>Email:</strong> {selectedUser?.email}
      </p>
      <p>
        <strong>Phone:</strong> {selectedUser?.phone}
      </p>
      <p>
        <strong>Address:</strong> {selectedUser?.address}
      </p>
      <p>
        <strong>Sex:</strong> {selectedUser?.sex}
      </p>
      <p>
        <strong>Group:</strong>{" "}
        {selectedUser?.groupId !== undefined
          ? groups.find((g) => g.id === selectedUser.groupId)?.name ||
            "Unknown Group"
          : "N/A"}
      </p>
    </Modal>
  );

  const UpdateModal = () => {
    const [form] = Form.useForm();

    useEffect(() => {
      form.setFieldsValue(selectedUser);
      console.log("Setting form fields:", selectedUser);
    }, [selectedUser]);

    return (
      <Modal
        title="Update User"
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={() => form.submit()}>
            Update
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sex"
            label="Sex"
            rules={[{ required: true, message: "Please input sex!" }]}
          >
            <Select placeholder="Select sex" style={{ width: "100%" }}>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="groupId"
            label="Group"
            rules={[{ required: true, message: "Please input group!" }]}
          >
            <Select placeholder="Select group" style={{ width: "100%" }}>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <Option key={group.id} value={group.id}>
                    {group.name}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  Loading groups...
                </Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const DeleteModal = () => (
    <Modal
      title="Confirm Delete"
      visible={isDeleteModalVisible}
      onOk={handleDelete}
      onCancel={handleCancel}
      okText="Yes"
      cancelText="No"
    >
      <p>Are you sure you want to delete user {selectedUser?.username}?</p>
    </Modal>
  );

  const CreateModal = () => {
    const [form] = Form.useForm();

    return (
      <Modal
        title="Create User"
        visible={isCreateModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={() => {
              console.log("Submit button clicked");
              form.submit();
            }}
          >
            Create
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="sex"
            label="Sex"
            rules={[{ required: true, message: "Please input sex!" }]}
          >
            <Select placeholder="Select sex" style={{ width: "100%" }}>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="groupId"
            label="Group"
            rules={[{ required: true, message: "Please input group!" }]}
          >
            <Select placeholder="Select group" style={{ width: "100%" }}>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <Option key={group.id} value={group.id}>
                    {group.name}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>
                  Loading groups...
                </Option>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="users-container">
      <Button
        type="primary"
        style={{ marginBottom: "20px" }}
        onClick={showCreateModal}
      >
        Create User
      </Button>
      {users.length > 0 ? (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
          locale={{ emptyText: "No users available" }}
        />
      ) : (
        <p>Loading users...</p>
      )}
      <ViewModal />
      <UpdateModal />
      <DeleteModal />
      <CreateModal />
    </div>
  );
};

export default Users;
