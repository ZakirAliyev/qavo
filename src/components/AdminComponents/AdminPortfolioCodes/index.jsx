import './index.scss';
import { Table, Button, message, Modal, Form, Input, Upload, Select } from 'antd';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { PORTFOLIO_CARD_IMAGE_URL, PORTFOLIO_IMAGE_URL } from '../../../constants.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import {
    useDeleteProjectMutation,
    useGetAllProjectsOfCodesQuery,
    usePostProjectsMutation,
    usePostReOrderProjectMutation,
    usePostUpdateProjectMutation,
} from '../../../services/userApi.jsx';

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

function AdminPortfolioCodes() {
    const { data: getAllProjectsOfAcademy, refetch, isLoading } = useGetAllProjectsOfCodesQuery();
    const [projects, setProjects] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form] = Form.useForm();
    const [postProjects] = usePostProjectsMutation();
    const [postReOrderProject] = usePostReOrderProjectMutation();
    const [postUpdateProject] = usePostUpdateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();
    const [deletedImageNames, setDeletedImageNames] = useState([]);
    const [deletedFileNames, setDeletedFileNames] = useState([]);
    const [isSaving, setIsSaving] = useState(false); // New state for loading

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    useEffect(() => {
        if (getAllProjectsOfAcademy?.data) {
            setProjects(getAllProjectsOfAcademy.data);
        }
    }, [getAllProjectsOfAcademy]);

    const handleReOrder = useCallback(
        async (projects) => {
            try {
                const orderInfo = projects.map((project, index) => ({
                    id: project.id,
                    orderId: index + 1,
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
        },
        [postReOrderProject]
    );

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
    const getImageUrl1 = (filename) => `${PORTFOLIO_IMAGE_URL}${filename}`;

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

    const showEditModal = (project) => {
        setEditingProject(project);
        setDeletedImageNames([]);
        setDeletedFileNames([]);
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
            academyMainMentor: project.academyMainMentor,
            academyAssiantMentor: project.academyAssiantMentor,
            academyDurationOfCourse: project.academyDurationOfCourse,
            academyCourseSchedule: project.academyCourseSchedule,
            mainImagePC: project.cardImage
                ? [
                    {
                        uid: '-1',
                        name: project.cardImage.split('/').pop(),
                        status: 'done',
                        url: getImageUrl(project.cardImage),
                    },
                ]
                : [],
            mainImageMobile: project.mobileCardImage
                ? [
                    {
                        uid: '-2',
                        name: project.mobileCardImage.split('/').pop(),
                        status: 'done',
                        url: getImageUrl(project.mobileCardImage),
                    },
                ]
                : [],
            images: project.images
                ? project.images.map((img, idx) => ({
                    uid: `img-${idx}`,
                    name: img.split('/').pop(),
                    status: 'done',
                    url: getImageUrl1(img),
                }))
                : [],
            files: project.files
                ? project.files.map((file, idx) => ({
                    uid: `file-${idx}`,
                    name: file.split('/').pop(),
                    status: 'done',
                    url: file,
                }))
                : [],
        });
        setIsModalVisible(true);
    };

    const showPostModal = () => {
        setEditingProject(null);
        setDeletedImageNames([]);
        setDeletedFileNames([]);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setDeletedImageNames([]);
        setDeletedFileNames([]);
        form.resetFields();
    };

    const handleRemove = (file, fieldName) => {
        if (file.url && file.name) {
            if (fieldName === 'images') {
                setDeletedImageNames((prev) => [...prev, file.name]);
            } else if (fieldName === 'files') {
                setDeletedFileNames((prev) => [...prev, file.name]);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true); // Start loading
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            // Append all fields
            formData.append('title', values.title || '');
            formData.append('titleEng', values.titleEng || '');
            formData.append('titleRu', values.titleRu || '');
            formData.append('subTitle', values.subTitle || '');
            formData.append('subTitleEng', values.subTitleEng || '');
            formData.append('subTitleRu', values.subTitleRu || '');
            formData.append('productionDate', values.productionDate || '');
            formData.append('vebSiteLink', values.vebSiteLink || '');
            formData.append('role', values.role || '');
            formData.append('roleEng', values.roleEng || '');
            formData.append('roleRu', values.roleRu || '');
            formData.append('team', values.team ? values.team.toLowerCase() : '');
            formData.append('academyMainMentor', values.academyMainMentor || '');
            formData.append('academyAssiantMentor', values.academyAssiantMentor || '');
            formData.append('academyDurationOfCourse', values.academyDurationOfCourse || '');
            formData.append('academyCourseSchedule', values.academyCourseSchedule || '');

            // Handle cardImage
            if (values.mainImagePC && values.mainImagePC[0]) {
                if (values.mainImagePC[0].originFileObj) {
                    formData.append('cardImage', values.mainImagePC[0].originFileObj);
                } else {
                    formData.append('cardImage', values.mainImagePC[0].name || '');
                }
            } else {
                formData.append('cardImage', '');
            }

            // Handle mobileCardImage
            if (values.mainImageMobile && values.mainImageMobile[0]) {
                if (values.mainImageMobile[0].originFileObj) {
                    formData.append('mobileCardImage', values.mainImageMobile[0].originFileObj);
                } else {
                    formData.append('mobileCardImage', values.mainImageMobile[0].name || '');
                }
            } else {
                formData.append('mobileCardImage', '');
            }

            // Handle images
            if (values.images && values.images.length > 0) {
                values.images.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append('images', file.originFileObj);
                    }
                });
            }

            // Handle files
            if (values.files && values.files.length > 0) {
                values.files.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append('files', file.originFileObj);
                    }
                });
            }

            // Append deleted image and file names
            deletedImageNames.forEach((name) => {
                formData.append('deleteImageNames', name);
            });
            deletedFileNames.forEach((name) => {
                formData.append('deleteFileNames', name);
            });

            if (editingProject) {
                formData.append('id', editingProject.id);
                await postUpdateProject(formData).unwrap();
                message.success('Proje başarıyla güncellendi');
            } else {
                await postProjects(formData).unwrap();
                message.success('Yeni proje başarıyla əlavə edildi');
            }

            refetch();
            setIsModalVisible(false);
            setDeletedImageNames([]);
            setDeletedFileNames([]);
        } catch (error) {
            console.error('Failed to save:', error);
            message.error('Proje işlənərkən xəta baş verdi');
        } finally {
            setIsSaving(false); // Stop loading
        }
    };

    const handleUploadChange = (info) => {
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
            title: 'Əlavə Şəkillər',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {images && images.length > 0 ? (
                        images.map((img, idx) => {
                            const isWebm = img.toLowerCase().endsWith('.webm');
                            console.log(img)
                            return isWebm ? (
                                <span key={idx} style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', background: '#f0f0f0' }}>
                        VIDEO
                    </span>
                            ) : (
                                <img
                                    key={idx}
                                    src={getImageUrl1(img)}
                                    alt={`Thumbnail ${idx}`}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                            );
                        })
                    ) : (
                        <span>Şəkil yoxdur</span>
                    )}
                </div>
            )
        },
        {
            title: 'Başlıq',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <div style={{ color: '#0c0c0c', fontWeight: '500' }}>{text}</div>,
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
                    <Button type="primary" icon={<FiEdit />} onClick={() => showEditModal(record)} />
                    <Button type="danger" icon={<FiTrash />} onClick={() => handleDelete(record.id)} />
                </div>
            ),
        },
    ];

    return (
        <section id="adminPortfolioCodes">
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showPostModal}>
                    Yeni Proje
                </Button>
            </div>
            <div style={{ height: '80vh', overflow: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={projects}
                    rowKey="id"
                    pagination={false}
                    loading={isLoading}
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
            </div>

            <Modal
                title={editingProject ? 'Projeni Düzənlə' : 'Yeni Proje'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel} disabled={isSaving}>
                        Ləğv et
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleSave}
                        loading={isSaving}
                        disabled={isSaving}
                    >
                        {editingProject ? 'Yadda Saxla' : 'Əlavə et'}
                    </Button>,
                ]}
                width={1320}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Column 1 */}
                        <div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '100%' }}>
                                    <Form.Item name="title" label="Başlıq (AZ) *">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="titleEng" label="Başlıq (EN) *">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="titleRu" label="Başlıq (RU) *">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="productionDate" label="İstehsal tarixi *">
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <Form.Item name="role" label="Layihə (AZ)">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="roleEng" label="Layihə (EN)">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="roleRu" label="Layihə (RU)">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="vebSiteLink" label="Veb sayt linki">
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item name="team" label="Team">
                                <Select placeholder="Seçin">
                                    <Option value="academy">academy</Option>
                                    <Option value="codes">codes</Option>
                                    <Option value="agency">agency</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="academyMainMentor" label="Əsas Mentor">
                                <Input />
                            </Form.Item>
                            <Form.Item name="academyAssiantMentor" label="Köməkçi Mentor">
                                <Input />
                            </Form.Item>
                            <Form.Item name="academyDurationOfCourse" label="Kursun Müddəti">
                                <Input />
                            </Form.Item>
                            <Form.Item name="academyCourseSchedule" label="Kursun Cədvəli">
                                <Input />
                            </Form.Item>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '100%' }}>
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
                                            onRemove={(file) => handleRemove(file, 'mainImagePC')}
                                            maxCount={1}
                                        >
                                            <Button icon={<UploadOutlined />}>Yüklə</Button>
                                        </Upload>
                                    </Form.Item>
                                </div>
                                <div style={{ width: '100%' }}>
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
                                            onRemove={(file) => handleRemove(file, 'mainImageMobile')}
                                            maxCount={1}
                                        >
                                            <Button icon={<UploadOutlined />}>Yüklə</Button>
                                        </Upload>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <Form.Item name="subTitle" label="Alt başlıq (AZ)">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="subTitleEng" label="Alt başlıq (EN)">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="subTitleRu" label="Alt başlıq (RU)">
                                <TextArea rows={4} />
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
                                    onChange={handleUploadChange}
                                    onRemove={(file) => handleRemove(file, 'images')}
                                    itemRender={(originNode, file) => {
                                        const fileName = file.name || '';
                                        const extension = fileName.split('.').pop().toLowerCase();
                                        return originNode;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Yüklə</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                name="files"
                                label="Fayllar"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    name="files"
                                    listType="text"
                                    multiple
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                    onRemove={(file) => handleRemove(file, 'files')}
                                >
                                    <Button icon={<UploadOutlined />}>Fayl Yüklə</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </section>
    );
}

export default AdminPortfolioCodes;