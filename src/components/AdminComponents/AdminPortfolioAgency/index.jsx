import './index.scss';
import {Table, Button, message, Modal, Form, Input, Upload} from 'antd';
import {FiTrash, FiEdit} from "react-icons/fi";
import {
    useGetAllProjectsOfAgencyQuery,
    useGetAllProjectsOfCodesQuery,
    usePostReOrderProjectMutation
} from "../../../services/userApi.jsx";
import {PORTFOLIO_CARD_IMAGE_URL} from "../../../constants.js";
import React, {useCallback, useEffect, useState} from "react";
import {useDrag, useDrop} from 'react-dnd';
import update from 'immutability-helper';

const {TextArea} = Input;

const ItemTypes = {
    ROW: 'row',
};

const DraggableRow = ({index, moveRow, className, style, ...restProps}) => {
    const ref = React.useRef();
    const [{isOver, dropClassName}, drop] = useDrop({
        accept: ItemTypes.ROW,
        collect: (monitor) => {
            const {index: dragIndex} = monitor.getItem() || {};
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
    const [{isDragging}, drag] = useDrag({
        type: ItemTypes.ROW,
        item: {index},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className} ${isOver ? dropClassName : ''}`}
            style={{cursor: 'move', ...style, opacity: isDragging ? 0.5 : 1}}
            {...restProps}
        />
    );
};

function AdminPortfolioAgency() {
    const {data: getAllProjectsOfAgency, refetch, isLoading} = useGetAllProjectsOfAgencyQuery();
    const [projects, setProjects] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form] = Form.useForm();
    const [postReOrderProject] = usePostReOrderProjectMutation();

    // Initialize projects data
    useEffect(() => {
        if (getAllProjectsOfAgency?.data) {
            setProjects(getAllProjectsOfAgency.data);
        }
    }, [getAllProjectsOfAgency]);

    // Handle reordering and API call
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

    const handleDelete = async (id) => {
        try {
            // Replace with your actual delete API call
            // await deleteProject(id);
            message.success('Proje başarıyla silindi');
            refetch();
        } catch (error) {
            message.error('Proje silinirken hata oluştu');
            console.error(error);
        }
    };

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
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('Updated values:', values);

            // Here you would typically call your API to update the project
            // await updateProject(editingProject.id, values);

            message.success('Proje başarıyla güncellendi');
            refetch();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Failed to save:', error);
            message.error('Proje güncellenirken hata oluştu');
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
                    style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px'}}
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
                    style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px'}}
                />
            ),
        },
        {
            title: 'Başlıq',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (
                <div style={{color: '#0c0c0c', fontWeight: '500'}}>
                    {text}
                </div>
            ),
        },
        {title: 'Tarix', dataIndex: 'productionDate', key: 'productionDate'},
        {title: 'Rol', dataIndex: 'role', key: 'role'},
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
                <div style={{display: 'flex', gap: '8px'}}>
                    <Button
                        type="primary"
                        icon={<FiEdit/>}
                        onClick={() => showEditModal(record)}
                    />
                    <Button
                        type="danger"
                        icon={<FiTrash/>}
                        onClick={() => handleDelete(record.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <section id="adminPortfolioCodes">
            <Table
                columns={columns}
                dataSource={projects}
                rowKey="id"
                loading={isLoading}
                pagination={{pageSize: 10000}}
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
                title="Projeni Düzənlə"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Ləğv et
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSave}>
                        Yadda Saxla
                    </Button>,
                ]}
                width={800}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        {/* Column 1 */}
                        <div>
                            <Form.Item name="title" label="Başlıq (AZ)">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="titleEng" label="Başlıq (EN)">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="titleRu" label="Başlıq (RU)">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="subTitle" label="Alt başlıq (AZ)">
                                <TextArea rows={3}/>
                            </Form.Item>
                            <Form.Item name="subTitleEng" label="Alt başlıq (EN)">
                                <TextArea rows={3}/>
                            </Form.Item>
                            <Form.Item name="subTitleRu" label="Alt başlıq (RU)">
                                <TextArea rows={3}/>
                            </Form.Item>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <Form.Item name="productionDate" label="İstehsal tarixi">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="vebSiteLink" label="Veb sayt linki">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="role" label="Rol (AZ)">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="roleEng" label="Rol (EN)">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="roleRu" label="Rol (RU)">
                                <Input/>
                            </Form.Item>
                            <Form.Item label="Əsas şəkil (PC)">
                                <Upload>
                                    <Button>Yüklə</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Əsas şəkil (MOBİL)">
                                <Upload>
                                    <Button>Yüklə</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </section>
    );
}

export default AdminPortfolioAgency;