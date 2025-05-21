import './index.scss';
import {Table, message} from 'antd';
import React, {useCallback, useEffect, useState} from "react";
import {useDrag, useDrop} from 'react-dnd';
import update from 'immutability-helper';
import {
    useGetAllSpinUserQuery,
    useReOrderTeamMembersMutation,
    useSpinMarkAsReadMutation
} from "../../../services/userApi.jsx";
import {toast, ToastContainer} from "react-toastify";

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

function AdminSpin() {
    const {data: getAllSpinUsers, refetch, isLoading} = useGetAllSpinUserQuery();
    const [spinUsers, setSpinUsers] = useState([]);
    const [postReOrderTeamMember] = useReOrderTeamMembersMutation();
    const [markAsRead] = useSpinMarkAsReadMutation();

    useEffect(() => {
        if (getAllSpinUsers?.data) {
            if (JSON.stringify(spinUsers) !== JSON.stringify(getAllSpinUsers.data)) {
                const sortedUsers = [...getAllSpinUsers.data].reverse();
                setSpinUsers(sortedUsers);
            }
        }
    }, [getAllSpinUsers]);

    const handleReOrder = useCallback(async (updatedSpinUsers) => {
        try {
            const orderInfo = updatedSpinUsers.map((user, index) => ({
                id: user.id,
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

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = spinUsers[dragIndex];
            const newSpinUsers = update(spinUsers, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragRow],
                ],
            });

            setSpinUsers(newSpinUsers);
            const timeout = setTimeout(() => {
                handleReOrder(newSpinUsers);
            }, 300);

            return () => clearTimeout(timeout);
        },
        [spinUsers, handleReOrder]
    );

    const handleMarkAsRead = async (id) => {
        try {
            const response = await markAsRead(id).unwrap();
            if (response?.statusCode === 200) {
                toast.success('İstifadəçi oxunmuş kimi qeyd edildi!', {
                    position: 'bottom-left',
                    autoClose: 2000,
                    theme: 'dark',
                });
                refetch();
            } else {
                toast.error('Oxunmuş kimi qeyd edərkən xəta baş verdi', {
                    position: 'bottom-left',
                    autoClose: 2000,
                    theme: 'dark',
                });
            }
        } catch (error) {
            toast.error('Oxunmuş kimi qeyd edərkən xəta baş verdi', {
                position: 'bottom-left',
                autoClose: 2000,
                theme: 'dark',
            });
        }
    };

    const expandedRowRender = (record) => (
        <div className="spin-user-details">
            <p>
                <strong>E-poçt: </strong>
                {record.email}
            </p>
            <p>
                <strong>Telefon: </strong>
                {record.number}
            </p>
            <p>
                <strong>Faiz: </strong>
                {record.percent}
            </p>
        </div>
    );

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
            title: 'Ad',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <div style={{color: '#0c0c0c', fontWeight: '500'}}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Soyad',
            dataIndex: 'surname',
            key: 'surname',
        },
        {
            title: 'E-poçt',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Telefon',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Faiz',
            dataIndex: 'percent',
            key: 'percent',
        },
        {
            title: 'Dərs Adı',
            dataIndex: 'lessonName',
            key: 'lessonName',
        },
        {
            title: 'Tarix',
            dataIndex: 'createdDate',
            key: 'createdDate',
        },
        {
            title: 'Əməliyyatlar',
            key: 'actions',
            render: (_, record) => (
                <div style={{
                    display: 'flex', gap: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <button
                        style={{
                            backgroundColor: record.isView ? '#e6f7ff' : '#f0f5ff',
                            borderColor: record.isView ? '#91d5ff' : '#adc6ff',
                            color: '#000'
                        }}
                        onClick={() => handleMarkAsRead(record.id)}
                        disabled={record.isView}
                        className={"anar"}
                    >
                        {record.isView ? 'Oxunmuş' : 'Oxunmuş kimi işarələ'}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <section id="adminSpin">
            <Table
                columns={columns}
                dataSource={spinUsers}
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
                    rowExpandable: (record) => !!record.email,
                }}
            />
            <ToastContainer/>
        </section>
    );
}

export default AdminSpin;