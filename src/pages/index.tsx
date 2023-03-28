import { definePageConfig } from 'ice';
import { Row, Col } from 'antd';

export default () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        CardBarChart
        {/* <CardBarChart /> */}
      </Col>
      <Col xs={24} sm={12} md={6}>
        CardAreaChart
        {/* <CardAreaChart /> */}
      </Col>
      <Col xs={24} sm={12} md={6}>
        CardTypebarChart
        {/* <CardTypebarChart /> */}
      </Col>
      <Col xs={24} sm={12} md={6}>
        CardLineChart
        {/* <CardLineChart /> */}
      </Col>
      <Col span={24}>
        CardRankChart
        {/* <CardRankChart /> */}
      </Col>
      <Col span={8}>
        CardPieChart
        {/* <CardPieChart /> */}
      </Col>
      <Col span={16}>
        CardGroupBarChart
        {/* <CardGroupBarChart /> */}
      </Col>
    </Row>
  );
}

// export const pageConfig = definePageConfig(() => {
//   return {
//     auth: ['admin', 'user'],
//   };
// });
