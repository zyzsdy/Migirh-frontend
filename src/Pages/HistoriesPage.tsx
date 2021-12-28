import { Layout, Skeleton, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CategoryValues, GetCategoriesResponse } from '../Components/NewTaskModal';
import { useGlobalStore } from '../Contexts/globalContext';
import { defaultApiErrorAction } from '../utils/defaultApiErrorAction';
import { fetchPostWithSign } from '../utils/fetchpost';
import './HistoriesPage.scss';

const { Sider, Content } = Layout;
const allTaskCate: CategoryValues = {
    cate_id: "",
    cate_name: "AllTask"
}

export default function HistoriesPage() {
    const [loading, setLoading] = useState(true);
    const [t, i18n] = useTranslation("tasks");
    const globalState = useGlobalStore();
    const [catelist, setCatelist] = useState<CategoryValues[]>([]);
    const [nowActiveCate, setNowActiveCate] = useState<CategoryValues>(allTaskCate);

    useEffect(() => {
        const loadCategories = async () => {
            let res = await fetchPostWithSign(globalState, "category/get", {});
            let json = await res.json() as GetCategoriesResponse;
    
            if (json.error === 0) {
                setLoading(false);
                setCatelist(json.data);
            } else {
                defaultApiErrorAction(json, t);
            }
        }

        loadCategories();
    }, []);

    const onCateNavClick = (cateId: string) => {
        let idx = catelist.findIndex(c => c.cate_id === cateId);

        if (idx === -1) {
            setNowActiveCate(allTaskCate);
        } else {
            setNowActiveCate(catelist[idx]);
        }
    }

    return (
        <Skeleton loading={loading} active paragraph={{rows: 14, width: 120}}>
            <Layout>
                <Sider width={150} className="categories-sider-background">
                    <ul className="categories-sider">
                        <li {...(nowActiveCate.cate_id === "" ? {className: "categories-sider-item categories-active"} : {className: "categories-sider-item"})} onClick={() => onCateNavClick("")}>
                            {t("AllTask", { ns: "categoriesTranslation"})}
                        </li>
                        {
                            catelist.map(o => (
                                <li {...(nowActiveCate.cate_id === o.cate_id ? {className: "categories-sider-item categories-active"} : {className: "categories-sider-item"})}
                                    key={o.cate_id} onClick={() => onCateNavClick(o.cate_id)}>
                                    {o.cate_name ? t(o.cate_name, { ns: "categoriesTranslation"}): t(o.cate_id, { ns: "categoriesTranslation"})}
                                </li>
                            ))
                        }
                    </ul>
                </Sider>
                <Content className="histories-content-background">
                    <div>
                        <Space>
                            <span>
                                {nowActiveCate.cate_name ? t(nowActiveCate.cate_name, { ns: "categoriesTranslation"}) : t(nowActiveCate.cate_id, { ns: "categoriesTranslation"})}
                            </span>
                        </Space>
                    </div>
                </Content>
            </Layout>
        </Skeleton>
    );
}
