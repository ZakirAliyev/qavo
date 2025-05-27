import './index.scss';
import { Table, Button, message, Modal, Form, Upload } from 'antd';
import { FiTrash } from 'react-icons/fi';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useGetAllBrandsQuery, usePostBrandMutation, useDeleteBrandMutation } from '../../../services/userApi.jsx';
import {BRAND_IMAGES} from "../../../constants.js";

function AdminBrands() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // RTK Query hooks
    const { data: getAllBrands, isLoading, isError, error, refetch: getAllBrandsRefetch } = useGetAllBrandsQuery();
    const [addBrand, { isLoading: isAdding }] = usePostBrandMutation();
    const [deleteBrand] = useDeleteBrandMutation();

    const brands = getAllBrands?.data


    // Normalize file values for upload
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleDelete = async (id) => {
        try {
            await deleteBrand(id).unwrap();
            getAllBrandsRefetch()
            message.success('Brend uğurla silindi');
        } catch (error) {
            message.error('Brend silinərkən xəta baş verdi');
            console.error(error);
        }
    };

    const showAddModal = () => {
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
            const formData = new FormData();
            if (values.brendImage && values.brendImage[0]) {
                formData.append('brendImage', values.brendImage[0].originFileObj);
            } else {
                throw new Error('Şəkil tələb olunur');
            }
            await addBrand(formData).unwrap();
            getAllBrandsRefetch()
            message.success('Yeni brend uğurla əlavə edildi');
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Failed to save:', error);
            message.error(error.message || 'Brend əlavə edilərkən xəta baş verdi');
        }
    };

    const handleUploadChange = (info) => {
        if (info.file.status === 'done' || info.file.status === 'error') {
            message.info(`${info.file.name} seçildi`);
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (_, record, index) => index + 1,
        },
        {
            title: 'Brend Şəkli',
            dataIndex: 'brendImage',
            key: 'brendImage',
            render: (text) =>
                text && (
                    <img
                        src={`${BRAND_IMAGES}${text}`}
                        alt="Brend"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                ),
        },
        {
            title: 'Əməliyyatlar',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                    <Button type="danger" icon={<FiTrash />} onClick={() => handleDelete(record.id)} />
                </div>
            ),
        },
    ];

    // Handle query error
    if (isError) {
        return (
            <section id="adminBrands">
                <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                    Brendlər yüklənərkən xəta baş verdi: {error?.data?.message || 'Bilinməyən xəta'}
                </div>
            </section>
        );
    }

    return (
        <section id="adminBrands">
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    Yeni Brend
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={brands}
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 5 }}
            />
            <Modal
                title="Yeni Brend"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel} disabled={isAdding}>
                        Ləğv et
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleSave}
                        loading={isAdding}
                        disabled={isAdding}
                    >
                        Əlavə et
                    </Button>,
                ]}
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="brendImage"
                        label="Brend Şəkli"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'Zəhmət olmasa brend şəklini yükləyin' }]}
                    >
                        <Upload
                            name="brendImage"
                            listType="picture-card"
                            beforeUpload={() => false}
                            onChange={handleUploadChange}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Yüklə</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
}

export default AdminBrands;