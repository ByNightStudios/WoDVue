/**
 *
 * SalesInfo
 *
 */

import React, { memo } from 'react';
import { Typography, Row, Skeleton } from 'antd';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import ResponsiveGrid from '../../ResponsiveGrid';

function SalesInfo(props) {

  if (!isUndefined(props.salesInformationDetails)) {
    const {
      salesInformationDetails: {
        amount_paid,
        campaign_date,
        campaign_name,
        employee_referred_name,
        lead_source,
        lead_source_category,
        plan_buyer_name,
        sales_closure_date,
        sales_comments,
        sales_person,
      },
    } = props;
    return (
      <Row gutter={[16, 16]}>
        <ResponsiveGrid title="Sales Person" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(sales_person)
              ? moment(sales_person).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Sales Closure Date" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(sales_closure_date)
              ? moment(sales_closure_date).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Plan Buyer Name" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(plan_buyer_name)
              ? moment(plan_buyer_name).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Amount Paid" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(amount_paid)
              ? moment(amount_paid).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Lead Source Category" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(lead_source_category)
              ? moment(lead_source_category).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Lead Source" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(lead_source)
              ? moment(lead_source).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Campaign Name" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(campaign_name)
              ? moment(campaign_name).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Campaign Date" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(campaign_date)
              ? moment(campaign_date).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Employee Referred Name" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(employee_referred_name)
              ? moment(employee_referred_name).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Language Preference" direction="vertical">
          <Typography.Text type="secondary">
            {!isEmpty(employee_referred_name)
              ? moment(employee_referred_name).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>

        <ResponsiveGrid title="Sales Comments" direction="vertical">
          <Typography.Text>
            {!isEmpty(sales_comments)
              ? sales_comments
              : 'No comments found'}
          </Typography.Text>
          <Typography.Text type="secondary">
            {!isEmpty(employee_referred_name)
              ? moment(employee_referred_name).format('DD-MM-YYYY hh:mm:ss A')
              : 'No data found'}
          </Typography.Text>
        </ResponsiveGrid>
      </Row>
    );
  }
  return <Skeleton />
}

SalesInfo.propTypes = {};

export default memo(SalesInfo);
