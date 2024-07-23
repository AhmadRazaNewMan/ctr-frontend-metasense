import React from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Spin } from "antd";

//Components
import useBreakpoint from "../../hooks/breakpoint";
import Loader from "../loader";

export default function BasePageContainer(props) {
  const isMobile = useBreakpoint();

  return (
    <PageContainer
      header={{
        title: props.title,
        breadcrumb: true ? props.breadcrumb : undefined,
        extra: props.extra,
      }}
      childrenContentStyle={isMobile ? { paddingInline: 15 } : {}}
      subTitle={props.subTitle}
    >
      <ProCard
        className={`mb-10 ${!props.transparent ? "shadow-lg" : ""}`}
        size="small"
        style={{ minHeight: 500 }}
        ghost={props.transparent}
        loading={
          props.loading ? (
            <Loader text={""} spinner={<Spin size="large" />} />
          ) : (
            false
          )
        }
      >
        {props.children}
      </ProCard>
    </PageContainer>
  );
}
