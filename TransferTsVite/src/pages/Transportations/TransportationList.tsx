import APP_ENV from "../../env/index.ts";
import React, { useEffect, useState } from "react";
import {ConfigProvider, InputNumber, Modal, Table, Tag, theme} from "antd";
import type { ColumnsType } from "antd/es/table";

interface Transportation {
    id: number;
    code: string;
    fromCityName: string;
    fromCountryName: string;
    toCityName: string;
    toCountryName: string;
    departureTime: string;
    arrivalTime: string;
    seatsAvailable: number;
    seatsTotal: number;
    statusName: string;
}

const TransportationsComponent: React.FC = () => {
    const [data, setData] = useState<Transportation[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const fetchData = async (): Promise<void> => {
        const response = await fetch(
            `${APP_ENV.API_BASE_URL}/api/Transportations/GetList`
        );

        if (!response.ok) {
            console.error("Failed to fetch transportations");
            return;
        }

        const result: Transportation[] = await response.json();
        setData(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBook = async (): Promise<void> => {
        if (selectedId === null) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("unauthorized");
            return;
        }

        await fetch(`${APP_ENV.API_BASE_URL}/api/Carts/AddUpdate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                transportationId: selectedId,
                quantity,
            }),
        });

        setOpen(false);
    };

    const openBookingModal = (id: number): void => {
        setSelectedId(id);
        setQuantity(1);
        setOpen(true);
    };

    const columns: ColumnsType<Transportation> = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "From",
            key: "from",
            render: (_, r) => `${r.fromCityName}, ${r.fromCountryName}`,
        },
        {
            title: "To",
            key: "to",
            render: (_, r) => `${r.toCityName}, ${r.toCountryName}`,
        },
        {
            title: "Departure",
            dataIndex: "departureTime",
            key: "departureTime",
        },
        {
            title: "Arrival",
            dataIndex: "arrivalTime",
            key: "arrivalTime",
        },
        {
            title: "Seats",
            key: "seats",
            render: (_, r) => `${r.seatsAvailable} / ${r.seatsTotal}`,
        },
        {
            title: "Status",
            dataIndex: "statusName",
            key: "statusName",
            render: (status: string) => (
                <Tag color={status === "Scheduled" ? "blue" : "default"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <a onClick={() => openBookingModal(record.id)}>Book</a>
            ),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
            <>
                <div className="overflow-x-auto">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        className="min-w-[850px]"
                    />
                </div>

                <Modal
                    title="Booking Seats"
                    open={open}
                    onCancel={() => setOpen(false)}
                    onOk={handleBook}
                    okText="Confirm booking"
                    styles={{
                        body: { backgroundColor: "#141414" },
                    }}
                >
                    <InputNumber
                        min={1}
                        value={quantity}
                        onChange={(value) =>
                            setQuantity(typeof value === "number" ? value : 1)
                        }
                        placeholder="Enter the number of seats"
                        style={{ width: "100%" }}
                    />
                </Modal>
            </>
        </ConfigProvider>
    );
};

export default TransportationsComponent;
