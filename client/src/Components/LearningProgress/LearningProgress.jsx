import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProgressUpdates,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate
} from "../../Redux/LearningProgress/Action";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Card,
  Tag,
  Space,
  Divider,
  Progress,
  Avatar,
  Timeline,
  Popconfirm
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ToolOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  BookOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./LearningProgress.css";

dayjs.extend(relativeTime);

const { Option } = Select;
const { TextArea } = Input;

const LearningProgress = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store.user);
  const { updates, loading } = useSelector((store) => store.learningProgress);

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(getProgressUpdates(token));
  }, [dispatch, token]);

  const handleSubmit = (values) => {
    const promise = editing 
      ? dispatch(updateProgressUpdate(token, editing.id, values))
      : dispatch(createProgressUpdate(token, values));
    
    promise.then(() => {
      message.success(
        editing ? "Update edited successfully!" : "New update added!"
      );
      form.resetFields();
      setIsModalOpen(false);
      setEditing(null);
    }).catch(() => {
      message.error("Something went wrong!");
    });
  };

  const handleTemplateChange = (value) => {
    const templates = {
      tutorial: {
        title: "📚 Completed a Tutorial",
        content: "Finished learning [topic] tutorial.",
        category: "learning"
      },
      skill: {
        title: "🛠️ Learned a New Skill",
        content: "I learned how to [skill].",
        category: "skill"
      },
      project: {
        title: "🚀 Built a Project",
        content: "I developed a project using [technology].",
        category: "project"
      },
      milestone: {
        title: "🏆 Achieved a Milestone",
        content: "I reached [milestone] in my learning journey!",
        category: "milestone"
      }
    };
    
    form.setFieldsValue(templates[value]);
  };

  const filteredUpdates = activeTab === "all" 
    ? updates 
    : updates.filter(update => update.category === activeTab);

  const getCategoryColor = (category) => {
    const colors = {
      learning: "blue",
      skill: "green",
      project: "purple",
      milestone: "gold"
    };
    return colors[category] || "gray";
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className="homepage-container min-h-screen"
      style={{
        backgroundImage: 'url("https://t3.ftcdn.net/jpg/02/98/77/98/360_F_298779829_ibEOUDbVsakvtZVH1vG0Mk0bt1FAoCNM.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >

    <div className="learning-progress-container">
      <div className="progress-header">
        <div className="header-content">
          <h1>My Learning Journey</h1>
          <p>Track and celebrate your progress in culinary education</p>
          
          <div className="progress-stats">
            <Card>
              <Space size="large">
                <div className="stat-item">
                  <Progress 
                    type="circle" 
                    percent={75} 
                    width={60} 
                    strokeColor="#f09433"
                    format={() => (
                      <TrophyOutlined style={{ color: "#f09433", fontSize: "24px" }} />
                    )}
                  />
                  <span>Course Completion</span>
                </div>
                <Divider type="vertical" />
                <div className="stat-item">
                  <Progress 
                    type="circle" 
                    percent={Math.min(updates.filter(u => u.category === "skill").length * 10, 100)} 
                    width={60} 
                    strokeColor="#52c41a"
                    format={() => (
                      <ToolOutlined style={{ color: "#52c41a", fontSize: "24px" }} />
                    )}
                  />
                  <span>Skills Learned</span>
                </div>
                <Divider type="vertical" />
                <div className="stat-item">
                  <Progress 
                    type="circle" 
                    percent={Math.min(updates.filter(u => u.category === "project").length * 20, 100)} 
                    width={60} 
                    strokeColor="#722ed1"
                    format={() => (
                      <RocketOutlined style={{ color: "#722ed1", fontSize: "24px" }} />
                    )}
                  />
                  <span>Projects Completed</span>
                </div>
              </Space>
            </Card>
          </div>
        </div>
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="add-update-btn"
        >
          Add Progress Update
        </Button>
      </div>

      <div className="progress-tabs">
        <Button.Group>
          <Button 
            type={activeTab === "all" ? "primary" : "default"} 
            onClick={() => handleTabChange("all")}
          >
            All Updates
          </Button>
          <Button 
            type={activeTab === "learning" ? "primary" : "default"} 
            onClick={() => handleTabChange("learning")}
            icon={<BookOutlined />}
          >
            Learning
          </Button>
          <Button 
            type={activeTab === "skill" ? "primary" : "default"} 
            onClick={() => handleTabChange("skill")}
            icon={<ToolOutlined />}
          >
            Skills
          </Button>
          <Button 
            type={activeTab === "project" ? "primary" : "default"} 
            onClick={() => handleTabChange("project")}
            icon={<RocketOutlined />}
          >
            Projects
          </Button>
          <Button 
            type={activeTab === "milestone" ? "primary" : "default"} 
            onClick={() => handleTabChange("milestone")}
            icon={<TrophyOutlined />}
          >
            Milestones
          </Button>
        </Button.Group>
      </div>

      <div className="progress-content">
        {filteredUpdates.length === 0 ? (
          <Card className="empty-state">
            <div className="empty-content">
              <img src="/images/empty-progress.svg" alt="No updates" />
              <h3>No updates found</h3>
              <p>Start by adding your first progress update!</p>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Update
              </Button>
            </div>
          </Card>
        ) : (
          <Timeline mode="alternate">
            {filteredUpdates.map((item) => (
              <Timeline.Item
                key={item.id}
                color={getCategoryColor(item.category)}
                dot={
                  <Avatar 
                    src={user?.image} 
                    icon={!user?.image && <CheckCircleOutlined />}
                  />
                }
              >
                <Card className="progress-card">
                  <div className="card-header">
                    <h3>{item.title}</h3>
                    <Tag color={getCategoryColor(item.category)}>
                      {item.category}
                    </Tag>
                  </div>
                  <p>{item.content}</p>
                  <div className="card-footer">
                    <span className="timestamp">
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                    <Space>
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => {
                          setEditing(item);
                          form.setFieldsValue(item);
                          setIsModalOpen(true);
                        }}
                      />
                      <Popconfirm
                        title="Are you sure to delete this update?"
                        onConfirm={() => {
                          dispatch(deleteProgressUpdate(token, item.id));
                          message.success("Update deleted!");
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        title={editing ? "Edit Progress Update ✏️" : "Add Progress Update 🚀"}
        width={600}
        className="progress-modal"
      >
        <Form 
          form={form} 
          onFinish={handleSubmit} 
          layout="vertical"
          initialValues={{ category: "learning" }}
        >
          {!editing && (
            <Form.Item label="Quick Templates" name="template">
              <Select
                placeholder="Select a template"
                onChange={handleTemplateChange}
                optionLabelProp="label"
              >
                <Option value="tutorial" label="📚 Tutorial">
                  <FileTextOutlined /> 📚 Completed Tutorial
                </Option>
                <Option value="skill" label="🛠️ Skill">
                  <ToolOutlined /> 🛠️ New Skill Learned
                </Option>
                <Option value="project" label="🚀 Project">
                  <RocketOutlined /> 🚀 Built a Project
                </Option>
                <Option value="milestone" label="🏆 Milestone">
                  <TrophyOutlined /> 🏆 Achieved Milestone
                </Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input 
              placeholder="e.g., Mastered French Pastry Techniques" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Details"
            rules={[{ required: true, message: "Please enter details" }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe what you learned or accomplished..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select size="large">
              <Option value="learning">📚 Learning</Option>
              <Option value="skill">🛠️ Skill</Option>
              <Option value="project">🚀 Project</Option>
              <Option value="milestone">🏆 Milestone</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </div>
  );
};

export default LearningProgress;