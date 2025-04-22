import './index.scss';
import { Table, Button, message, Modal, Form, Input, Upload, Select } from 'antd';
import { FiTrash, FiEdit } from "react-icons/fi";
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
    useDeleteProjectMutation,
    useGetAllProjectsOfAcademyQuery,
    usePostProjectsMutation,
    usePostReOrderProjectMutation,
    usePostUpdateProjectMutation
} from "../../../services/userApi.jsx";
import { PORTFOLIO_CARD_IMAGE_URL } from "../../../constants.js";
import React, { useCallback, useEffect, useState } from "react";
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

const { TextArea } = Input;
const { Option } = Select;

const ItemTypes = {
    ROW: 'row',
};

const DraggableRow = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = React.useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: ItemTypes.ROW,
        collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? 'drop-over-downward' : 'drop-over-upward',
            };
        },
        drop: (item) => {
            moveRow(item.index, index);
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ROW,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className} ${isOver ? dropClassName : ''}`}
            style={{ cursor: 'move', ...style, opacity: isDragging ? 0.5 : 1 }}
            {...restProps}
        />
    );
};

function AdminPortfolioAcademy() {
    const { data: getAllProjectsOfAcademy, refetch, isLoading } = useGetAllProjectsOfAcademyQuery();
    const [projects, setProjects] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form] = Form.useForm();
    const [postProjects] = usePostProjectsMutation();
    const [postReOrderProject] = usePostReOrderProjectMutation();
    const [postUpdateProject] = usePostUpdateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();

    // Fayl dəyərlərini normallaşdıran funksiya
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // Layihə məlumatlarını yükləyirik
    useEffect(() => {
        if (getAllProjectsOfAcademy?.data) {
            setProjects(getAllProjectsOfAcademy.data);
        }
    }, [getAllProjectsOfAcademy]);

    // Sıralamanın yenilənməsi
    const handleReOrder = useCallback(async (projects) => {
        try {
            const orderInfo = projects.map((project, index) => ({
                id: project.id,
                orderId: index + 1
            }));

            const response = await postReOrderProject(orderInfo).unwrap();

            if (response?.statusCode === 200) {
                message.success('Sıralama başarıyla güncellendi!');
            } else {
                message.error('Sıralama güncellenirken hata oluştu');
            }
        } catch (error) {
            console.error('Re-order error:', error);
            message.error('Sıralama güncellenirken hata oluştu');
        }
    }, [postReOrderProject]);

    const moveRow = useCallback(
        async (dragIndex, hoverIndex) => {
            const dragRow = projects[dragIndex];
            const newProjects = update(projects, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragRow],
                ],
            });

            setProjects(newProjects);
            await handleReOrder(newProjects);
        },
        [projects, handleReOrder]
    );

    const getImageUrl = (filename) => `${PORTFOLIO_CARD_IMAGE_URL}${filename}`;

    const expandedRowRender = (record) => (
        <div className="project-details">
            <p>
                <strong>Açıqlama: </strong>
                <div>{record.subTitle}</div>
                <div>{record.subTitleEng}</div>
                <div>{record.subTitleRu}</div>
            </p>
        </div>
    );

    // Delete funksiyası: Seçilmiş layihəni backend-dən silir
    const handleDelete = async (id) => {
        try {
            await deleteProject(id).unwrap();
            message.success('Proje başarıyla silindi');
            refetch();
        } catch (error) {
            message.error('Proje silinirken hata oluştu');
            console.error(error);
        }
    };

    // Redaktə modalını açmaq üçün funksiya
    const showEditModal = (project) => {
        setEditingProject(project);
        form.setFieldsValue({
            title: project.title,
            titleEng: project.titleEng,
            titleRu: project.titleRu,
            subTitle: project.subTitle,
            subTitleEng: project.subTitleEng,
            subTitleRu: project.subTitleRu,
            productionDate: project.productionDate,
            vebSiteLink: project.vebSiteLink,
            role: project.role,
            roleEng: project.roleEng,
            roleRu: project.roleRu,
            team: project.team,
            mainImagePC: project.cardImage ? [{
                uid: '-1',
                name: project.cardImage.split('/').pop(),
                status: 'done',
                url: getImageUrl(project.cardImage),
            }] : [],
            mainImageMobile: project.mobileCardImage ? [{
                uid: '-1',
                name: project.mobileCardImage.split('/').pop(),
                status: 'done',
                url: getImageUrl(project.mobileCardImage),
            }] : [],
            images: []
        });
        setIsModalVisible(true);
    };

    // Yeni layihə əlavə etmək üçün modalı açan funksiya
    const showPostModal = () => {
        setEditingProject(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingProject) {
                // Update əməliyyatı üçün FormData yaradılır
                const formData = new FormData();
                formData.append('id', editingProject.id);
                formData.append('title', values.title);
                formData.append('titleEng', values.titleEng);
                formData.append('titleRu', values.titleRu);
                formData.append('subTitle', values.subTitle);
                formData.append('subTitleEng', values.subTitleEng);
                formData.append('subTitleRu', values.subTitleRu);
                formData.append('productionDate', values.productionDate);
                formData.append('vebSiteLink', values.vebSiteLink);
                if (values.mainImagePC && values.mainImagePC[0]) {
                    if (values.mainImagePC[0].originFileObj) {
                        formData.append('cardImage', values.mainImagePC[0].originFileObj);
                    } else {
                        formData.append('cardImage', values.mainImagePC[0].url);
                    }
                } else {
                    formData.append('cardImage', '');
                }
                if (values.mainImageMobile && values.mainImageMobile[0]) {
                    if (values.mainImageMobile[0].originFileObj) {
                        formData.append('mobileCardImage', values.mainImageMobile[0].originFileObj);
                    } else {
                        formData.append('mobileCardImage', values.mainImageMobile[0].url);
                    }
                } else {
                    formData.append('mobileCardImage', '');
                }
                formData.append('role', values.role);
                formData.append('roleEng', values.roleEng);
                formData.append('roleRu', values.roleRu);
                if (values.images && values.images.length > 0) {
                    values.images.forEach((file) => {
                        formData.append('images', file.originFileObj);
                    });
                }
                formData.append('team', values.team ? values.team.toLowerCase() : '');
                await postUpdateProject(formData).unwrap();
                message.success('Proje başarıyla güncellendi');
            } else {
                // Yeni layihə əlavə edərkən, FormData yaradılır
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('titleEng', values.titleEng);
                formData.append('titleRu', values.titleRu);
                formData.append('subTitle', values.subTitle);
                formData.append('subTitleEng', values.subTitleEng);
                formData.append('subTitleRu', values.subTitleRu);
                formData.append('productionDate', values.productionDate);
                formData.append('vebSiteLink', values.vebSiteLink);
                if (values.mainImagePC && values.mainImagePC[0]) {
                    if (values.mainImagePC[0].originFileObj) {
                        formData.append('cardImage', values.mainImagePC[0].originFileObj);
                    } else {
                        formData.append('cardImage', values.mainImagePC[0].url);
                    }
                } else {
                    formData.append('cardImage', '');
                }
                if (values.mainImageMobile && values.mainImageMobile[0]) {
                    if (values.mainImageMobile[0].originFileObj) {
                        formData.append('mobileCardImage', values.mainImageMobile[0].originFileObj);
                    } else {
                        formData.append('mobileCardImage', values.mainImageMobile[0].url);
                    }
                } else {
                    formData.append('mobileCardImage', '');
                }
                formData.append('role', values.role);
                formData.append('roleEng', values.roleEng);
                formData.append('roleRu', values.roleRu);
                if (values.images && values.images.length > 0) {
                    values.images.forEach((file) => {
                        formData.append('images', file.originFileObj);
                    });
                }
                formData.append('team', values.team ? values.team.toLowerCase() : '');
                await postProjects(formData).unwrap();
                message.success('Yeni proje başarıyla əlavə edildi');
            }
            refetch();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Failed to save:', error);
            message.error('Proje işlənərkən xəta baş verdi');
        }
    };

    const handleUploadChange = (info) => {
        // Auto-upload söndürülü olduğundan, fayl seçildikdə sadəcə məlumat veririk
        if (info.file.status === 'done' || info.file.status === 'error') {
            message.info(`${info.file.name} seçildi`);
        }
    };

    const components = {
        body: {
            row: DraggableRow,
        },
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (_, record, index) => index + 1,
        },
        {
            title: 'Əsas şəkil (PC)',
            dataIndex: 'cardImage',
            key: 'cardImage',
            render: (text) => (
                <img
                    src={getImageUrl(text)}
                    alt="Card"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                />
            ),
        },
        {
            title: 'Əsas şəkil (MOBİL)',
            dataIndex: 'mobileCardImage',
            key: 'mobileCardImage',
            render: (text) => (
                <img
                    src={getImageUrl(text)}
                    alt="Card"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                />
            ),
        },
        {
            title: 'Başlıq',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (
                <div style={{ color: '#0c0c0c', fontWeight: '500' }}>
                    {text}
                </div>
            ),
        },
        { title: 'Tarix', dataIndex: 'productionDate', key: 'productionDate' },
        { title: 'Rol', dataIndex: 'role', key: 'role' },
        {
            title: 'Veb sayt',
            dataIndex: 'vebSiteLink',
            key: 'vebSiteLink',
            render: (link) => (
                <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                </a>
            ),
        },
        {
            title: 'Əməliyyatlar',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        icon={<FiEdit />}
                        onClick={() => showEditModal(record)}
                    />
                    <Button
                        type="danger"
                        icon={<FiTrash />}
                        onClick={() => handleDelete(record.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <section id="adminPortfolioCodes">
            {/* + düyməsi vasitəsilə yeni layihə əlavə etmək */}
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showPostModal}>
                    Yeni Proje
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={projects}
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 10000 }}
                components={components}
                onRow={(record, index) => ({
                    index,
                    moveRow,
                })}
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => !!record.subTitle,
                }}
            />

            <Modal
                title={editingProject ? "Projeni Düzənlə" : "Yeni Proje"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Ləğv et
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSave}>
                        {editingProject ? "Yadda Saxla" : "Əlavə et"}
                    </Button>,
                ]}
                width={800}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Column 1 */}
                        <div>
                            <Form.Item name="title" label="Başlıq (AZ)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="titleEng" label="Başlıq (EN)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="titleRu" label="Başlıq (RU)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="subTitle" label="Alt başlıq (AZ)">
                                <TextArea rows={3} />
                            </Form.Item>
                            <Form.Item name="subTitleEng" label="Alt başlıq (EN)">
                                <TextArea rows={3} />
                            </Form.Item>
                            <Form.Item name="subTitleRu" label="Alt başlıq (RU)">
                                <TextArea rows={3} />
                            </Form.Item>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <Form.Item name="productionDate" label="İstehsal tarixi">
                                <Input />
                            </Form.Item>
                            <Form.Item name="vebSiteLink" label="Veb sayt linki">
                                <Input />
                            </Form.Item>
                            <Form.Item name="role" label="Rol (AZ)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="roleEng" label="Rol (EN)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="roleRu" label="Rol (RU)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="team" label="Team">
                                <Select placeholder="Seçin">
                                    <Option value="academy">academy</Option>
                                    <Option value="codes">codes</Option>
                                    <Option value="agency">agency</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="mainImagePC"
                                label="Əsas şəkil (PC)"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                >
                                    <Button icon={<UploadOutlined />}>Yüklə</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="mainImageMobile"
                                label="Əsas şəkil (MOBİL)"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                >
                                    <Button icon={<UploadOutlined />}>Yüklə</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="images"
                                label="Əlavə Şəkillər"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    name="images"
                                    listType="picture-card"
                                    multiple
                                    beforeUpload={() => false}
                                >
                                    <Button icon={<UploadOutlined />}>Yüklə</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </section>
    );
}

export default AdminPortfolioAcademy;
