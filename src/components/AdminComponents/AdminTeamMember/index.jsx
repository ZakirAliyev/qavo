import './index.scss';
import { Table, Button, message, Modal, Form, Input, Upload, Select } from 'antd';
import { FiTrash, FiEdit } from "react-icons/fi";
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { OUR_TEAM_IMAGES_URL } from "../../../constants.js";
import {
    useDeleteTeamMemberMutation,
    usePostTeamMemberMutation,
    useReOrderTeamMembersMutation,
    useUpdateTeamMembersMutation,
    useGetAllTeamMembersQuery
} from "../../../services/userApi.jsx";

const { TextArea } = Input;
const { Option } = Select;

const ItemTypes = {
    ROW: 'row',
};

// eslint-disable-next-line react/prop-types
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

function AdminTeamMember() {
    const { data: getAllTeamMembers, refetch, isLoading } = useGetAllTeamMembersQuery();
    const [teamMembers, setTeamMembers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false); // New state for save button loading
    const [postTeamMember] = usePostTeamMemberMutation();
    const [postReOrderTeamMember] = useReOrderTeamMembersMutation();
    const [postUpdateTeamMember] = useUpdateTeamMembersMutation();
    const [deleteTeamMember] = useDeleteTeamMemberMutation();

    // Normalize file values for upload
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // Update teamMembers only if the data has actually changed
    useEffect(() => {
        if (getAllTeamMembers?.data) {
            // Deep comparison to avoid unnecessary updates
            if (JSON.stringify(teamMembers) !== JSON.stringify(getAllTeamMembers.data)) {
                setTeamMembers(getAllTeamMembers.data);
            }
        }
    }, [getAllTeamMembers]);

    // Memoize handleReOrder to prevent unnecessary re-renders
    const handleReOrder = useCallback(async (updatedTeamMembers) => {
        try {
            const orderInfo = updatedTeamMembers.map((member, index) => ({
                id: member.id,
                orderId: (index + 1).toString(),
            }));

            const response = await postReOrderTeamMember(orderInfo).unwrap();

            if (response?.statusCode === 200) {
                message.success('Sıralama uğurla yeniləndi!');
            } else {
                message.error('Sıralama yenilənərkən xəta baş verdi');
            }
        } catch (error) {
            console.error('Re-order error:', error);
            message.error('Sıralama yenilənərkən xəta baş verdi');
        }
    }, [postReOrderTeamMember]);

    // Memoize moveRow to prevent re-creation on every render
    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = teamMembers[dragIndex];
            const newTeamMembers = update(teamMembers, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragRow],
                ],
            });

            setTeamMembers(newTeamMembers);
            // Debounce the handleReOrder call to prevent rapid updates
            const timeout = setTimeout(() => {
                handleReOrder(newTeamMembers);
            }, 300);

            return () => clearTimeout(timeout);
        },
        [teamMembers, handleReOrder]
    );

    const getImageUrl = (filename) => `${OUR_TEAM_IMAGES_URL}${filename}`;

    const expandedRowRender = (record) => (
        <div className="team-member-details">
            <p>
                <strong>Vəzifə: </strong>
                <div>{record.position}</div>
                <div>{record.positionEng}</div>
                <div>{record.positionRu}</div>
            </p>
            <p>
                <strong>Komanda: </strong>
                {record.team}
            </p>
            <p>
                <strong>Başlama tarixi: </strong>
                {record.sinceYear}
            </p>
        </div>
    );

    const handleDelete = async (id) => {
        try {
            await deleteTeamMember(id).unwrap();
            message.success('Komanda üzvü uğurla silindi');
            refetch();
        } catch (error) {
            message.error('Komanda üzvü silinərkən xəta baş verdi');
            console.error(error);
        }
    };

    const showEditModal = (member) => {
        setEditingMember(member);
        form.setFieldsValue({
            fullName: member.fullName,
            fullNameEng: member.fullNameEng,
            fullNameRu: member.fullNameRu,
            position: member.position,
            positionEng: member.positionEng,
            positionRu: member.positionRu,
            sinceYear: member.sinceYear,
            team: member.team,
            profilImage: member.profilImage ? [{
                uid: '-1',
                name: member.profilImage.split('/').pop(),
                status: 'done',
                url: getImageUrl(member.profilImage),
            }] : [],
        });
        setIsModalVisible(true);
    };

    const showPostModal = () => {
        setEditingMember(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            setIsSaving(true); // Set loading state to true
            const values = await form.validateFields();
            const formData = new FormData();

            if (editingMember) {
                formData.append('id', editingMember.id);
                formData.append('fullName', values.fullName);
                formData.append('fullNameEng', values.fullNameEng);
                formData.append('fullNameRu', values.fullNameRu);
                formData.append('position', values.position);
                formData.append('positionEng', values.positionEng);
                formData.append('positionRu', values.positionRu);
                formData.append('sinceYear', values.sinceYear);
                formData.append('team', values.team ? values.team.toLowerCase() : '');
                if (values.profilImage && values.profilImage[0]) {
                    if (values.profilImage[0].originFileObj) {
                        formData.append('profilImage', values.profilImage[0].originFileObj);
                    } else {
                        formData.append('profilImage', values.profilImage[0].url);
                    }
                } else {
                    formData.append('profilImage', '');
                }

                await postUpdateTeamMember(formData).unwrap();
                message.success('Komanda üzvü uğurla yeniləndi');
            } else {
                formData.append('fullName', values.fullName);
                formData.append('fullNameEng', values.fullNameEng);
                formData.append('fullNameRu', values.fullNameRu);
                formData.append('position', values.position);
                formData.append('positionEng', values.positionEng);
                formData.append('positionRu', values.positionRu);
                formData.append('sinceYear', values.sinceYear);
                formData.append('team', values.team ? values.team.toLowerCase() : '');
                if (values.profilImage && values.profilImage[0]) {
                    if (values.profilImage[0].originFileObj) {
                        formData.append('profilImage', values.profilImage[0].originFileObj);
                    } else {
                        formData.append('profilImage', values.profilImage[0].url);
                    }
                } else {
                    formData.append('profilImage', '');
                }

                await postTeamMember(formData).unwrap();
                message.success('Yeni komanda üzvü uğurla əlavə edildi');
            }
            refetch();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Failed to save:', error);
            message.error('Komanda üzvü işlənərkən xəta baş verdi');
        } finally {
            setIsSaving(false); // Reset loading state
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
            title: 'Profil Şəkli',
            dataIndex: 'profilImage',
            key: 'profilImage',
            render: (text) => (
                <img
                    src={getImageUrl(text)}
                    alt="Profil"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                />
            ),
        },
        {
            title: 'Ad Soyad (AZ)',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => (
                <div style={{ color: '#0c0c0c', fontWeight: '500' }}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Ad Soyad (EN)',
            dataIndex: 'fullNameEng',
            key: 'fullNameEng',
        },
        {
            title: 'Ad Soyad (RU)',
            dataIndex: 'fullNameRu',
            key: 'fullNameRu',
        },
        {
            title: 'Vəzifə (AZ)',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Vəzifə (EN)',
            dataIndex: 'positionEng',
            key: 'positionEng',
        },
        {
            title: 'Vəzifə (RU)',
            dataIndex: 'positionRu',
            key: 'positionRu',
        },
        {
            title: 'Başlama Tarixi',
            dataIndex: 'sinceYear',
            key: 'sinceYear',
        },
        {
            title: 'Komanda',
            dataIndex: 'team',
            key: 'team',
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
        <section id="adminTeamMember">
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showPostModal}>
                    Yeni Komanda Üzvü
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={teamMembers}
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
                    rowExpandable: (record) => !!record.position,
                }}
            />

            <Modal
                title={editingMember ? "Komanda Üzvünü Düzənlə" : "Yeni Komanda Üzvü"}
                open={isModalVisible}
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
                        {editingMember ? "Yadda Saxla" : "Əlavə et"}
                    </Button>,
                ]}
                width={800}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Column 1 */}
                        <div>
                            <Form.Item name="fullName" label="Ad Soyad (AZ)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="fullNameEng" label="Ad Soyad (EN)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="fullNameRu" label="Ad Soyad (RU)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="position" label="Vəzifə (AZ)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="positionEng" label="Vəzifə (EN)">
                                <Input />
                            </Form.Item>
                            <Form.Item name="positionRu" label="Vəzifə (RU)">
                                <Input />
                            </Form.Item>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <Form.Item name="sinceYear" label="Başlama Tarixi">
                                <Input />
                            </Form.Item>
                            <Form.Item name="team" label="Komanda">
                                <Select placeholder="Seçin">
                                    <Option value="academy">academy</Option>
                                    <Option value="codes">codes</Option>
                                    <Option value="agency">agency</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="profilImage"
                                label="Profil Şəkli"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                    maxCount={1} // Yalnız bir şəkil yüklənməsinə icazə verir
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

export default AdminTeamMember;