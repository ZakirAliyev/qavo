import React, {useEffect, useState, useCallback, useRef} from 'react';
import {Table, Button, message, Modal, Form, Input, Upload} from 'antd';
import {FiTrash, FiEdit} from "react-icons/fi";
import {
    useGetAllProjectsOfCodesQuery,
    usePostReOrderProjectMutation, usePostUpdateProjectMutation
} from "../../../services/userApi.jsx";
import {PORTFOLIO_CARD_IMAGE_URL, PORTFOLIO_IMAGE_URL} from "../../../constants.js";
import {useDrag, useDrop} from 'react-dnd';
import update from 'immutability-helper';
import './index.scss';

const {TextArea} = Input;

const ItemTypes = {
    ROW: 'row',
};

const DraggableRow = ({index, moveRow, className, style, ...restProps}) => {
    const ref = useRef();

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

function AdminPortfolioCodes() {
    const {data: getAllProjectsOfCodes, refetch, isLoading} = useGetAllProjectsOfCodesQuery();
    const [postReOrderProject] = usePostReOrderProjectMutation();

    const [postUpdateProject] = usePostUpdateProjectMutation();
    // const [deleteProject] = useDeleteProjectMutation();

    const [projects, setProjects] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form] = Form.useForm();

    // Upload alanları için state
    const [cardImageList, setCardImageList] = useState([]);
    const [mobileCardImageList, setMobileCardImageList] = useState([]);
    const [imagesList, setImagesList] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);

    // API’den ilk veriyi çekme
    useEffect(() => {
        if (getAllProjectsOfCodes?.data) {
            setProjects(getAllProjectsOfCodes.data);
        }
    }, [getAllProjectsOfCodes]);

    // Sürükle-bırak sıralama
    const handleReOrder = useCallback(
        async (newProjects) => {
            try {
                const orderInfo = newProjects.map((project, index) => ({
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

    // Tabloda satır genişletme (subTitle vs. detay)
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

    // Proje silme örneği (kendi API’nize uyarlayın)
    const handleDelete = async (id) => {
        try {
            // await deleteProject(id).unwrap();
            message.success('Proje başarıyla silindi');
            refetch();
        } catch (error) {
            message.error('Proje silinirken hata oluştu');
            console.error(error);
        }
    };

    // Düzenleme modali açma
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

        // PC kart resmi
        setCardImageList(
            project.cardImage
                ? [
                    {
                        uid: '-1',
                        name: 'cardImage',
                        status: 'done',
                        url: getImageUrl(project.cardImage),
                    },
                ]
                : []
        );

        // Mobil kart resmi
        setMobileCardImageList(
            project.mobileCardImage
                ? [
                    {
                        uid: '-2',
                        name: 'mobileCardImage',
                        status: 'done',
                        url: getImageUrl(project.mobileCardImage),
                    },
                ]
                : []
        );

        // Çoklu resimler
        setImagesList(
            (project.images || []).map((img, idx) => ({
                uid: String(idx),
                name: img, // Silme işlemi için orijinal ad
                status: 'done',
                url: getImageUrl1(img),
            }))
        );

        setDeletedImages([]);
        setIsModalVisible(true);
    };

    // Modali kapatma
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setCardImageList([]);
        setMobileCardImageList([]);
        setImagesList([]);
        setDeletedImages([]);
    };

    // Upload onChange eventleri
    const onCardImageChange = ({fileList}) => {
        setCardImageList(fileList);
    };
    const onMobileCardImageChange = ({fileList}) => {
        setMobileCardImageList(fileList);
    };
    const onImagesChange = ({fileList}) => {
        setImagesList(fileList);
    };

    // Mevcut resim silindiğinde, backend’e bildirilecek isimleri topluyoruz
    const handleRemoveImage = (file) => {
        if (file.status === 'done') {
            // Sunucudan gelen bir resim ise, silinecekler listesine ekle
            setDeletedImages((prev) => [...prev, file.name]);
        }
        // Ant Design otomatik olarak fileList’i güncelliyor
    };

    // Düzenleme kaydetme (örnek FormData ile)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // FormData oluşturma
            const formData = new FormData();
            formData.append('id', editingProject.id);
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

            // PC resmi
            if (cardImageList.length > 0) {
                const file = cardImageList[0].originFileObj;
                if (file) {
                    formData.append('CardImage', file);
                }
            } else {
                formData.append('CardImage', '');
            }

            // Mobil resmi
            if (mobileCardImageList.length > 0) {
                const file = mobileCardImageList[0].originFileObj;
                if (file) {
                    formData.append('MobileCardImage', file);
                }
            } else {
                formData.append('MobileCardImage', '');
            }

            // Çoklu resimler
            imagesList.forEach((fileItem) => {
                if (fileItem.originFileObj) {
                    formData.append('Images', fileItem.originFileObj);
                }
            });

            // Silinecek resimlerin isimleri
            deletedImages.forEach((imgName) => {
                formData.append('DeleteImageNames', imgName);
            });

            // Backend’e istek atma (kendi update endpoint’inize uyarlayın)
            // const response = await updateProject(formData).unwrap();
            // if (response.statusCode === 200) {
            //   message.success('Proje başarıyla güncellendi');
            //   refetch();
            //   setIsModalVisible(false);
            // } else {
            //   message.error('Proje güncellenirken hata oluştu');
            // }

            // DEMO:
            console.log('FormData Gönderiliyor ->', values, deletedImages);
            message.success('Proje başarıyla güncellendi (Demo)');
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
            render: (_, __, index) => index + 1,
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
        {title: 'Əməkdaşlıq', dataIndex: 'role', key: 'role'},
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
                        danger
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
                width={1320}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        {/* Sütun 1 */}
                        <div>
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                            }}>
                                <div style={{
                                    width: '100%'
                                }}>
                                    <Form.Item name="title" label="Başlıq (AZ)">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="titleEng" label="Başlıq (EN)">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="titleRu" label="Başlıq (RU)">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="productionDate" label="İstehsal tarixi">
                                        <Input/>
                                    </Form.Item>
                                </div>
                                <div style={{
                                    width: '100%'
                                }}>
                                    <Form.Item name="role" label="Rol (AZ)">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="roleEng" label="Rol (EN)">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="roleRu" label="Rol (RU)">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="vebSiteLink" label="Veb sayt linki">
                                        <Input/>
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item name="subTitle" label="Alt başlıq (AZ)">
                                <TextArea rows={2}/>
                            </Form.Item>
                            <Form.Item name="subTitleEng" label="Alt başlıq (EN)">
                                <TextArea rows={2}/>
                            </Form.Item>
                            <Form.Item name="subTitleRu" label="Alt başlıq (RU)">
                                <TextArea rows={2}/>
                            </Form.Item>
                        </div>
                        <div>
                            <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
                                <div>
                                    <p>Əsas şəkil (PC)</p>
                                    <Upload
                                        listType="picture-card"
                                        fileList={cardImageList}
                                        onChange={onCardImageChange}
                                        onRemove={handleRemoveImage}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                    >
                                        {cardImageList.length < 1 && '+ Upload'}
                                    </Upload>
                                </div>
                                <div>
                                    <p>Əsas şəkil (MOBİL)</p>
                                    <Upload
                                        listType="picture-card"
                                        fileList={mobileCardImageList}
                                        onChange={onMobileCardImageChange}
                                        onRemove={handleRemoveImage}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                    >
                                        {mobileCardImageList.length < 1 && '+ Upload'}
                                    </Upload>
                                </div>
                            </div>

                            <Form.Item label="Daha çox şəkillər (İstəyə bağlı)">
                                <Upload
                                    listType="picture-card"
                                    fileList={imagesList}
                                    onChange={onImagesChange}
                                    onRemove={handleRemoveImage}
                                    beforeUpload={() => false}
                                    multiple
                                >
                                    '+ Upload'
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
