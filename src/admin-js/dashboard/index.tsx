import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  H2,
  H5,
  Illustration,
  IllustrationProps,
  Text,
} from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { ApiClient, Filter, useTranslation } from 'adminjs';
import moment from 'moment';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ComposedChart,
  Area,
} from 'recharts';
import { ChartItem } from './ChartItem.js';

const pageHeaderHeight = 284;
const pageHeaderPaddingY = 74;
const pageHeaderPaddingX = 250;

export const DashboardHeader: React.FC = () => {
  const { translateMessage } = useTranslation();
  return (
    <Box position="relative" overflow="hidden" data-css="default-dashboard">
      <Box
        position="absolute"
        top={50}
        left={-10}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Rocket" />
      </Box>
      <Box
        position="absolute"
        top={-70}
        right={-15}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Moon" />
      </Box>
      <Box
        bg="grey100"
        height={pageHeaderHeight}
        py={pageHeaderPaddingY}
        px={['default', 'lg', pageHeaderPaddingX]}
      >
        <Text textAlign="center" color="white">
          <H2>{translateMessage('welcomeOnBoard_title')}</H2>
          <Text opacity={0.8}>
            {translateMessage('welcomeOnBoard_subtitle')}
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

type BoxType = {
  variant: string;
  title: string;
  subtitle: string;
  href: string;
};

const boxes = ({ translateMessage }): Array<BoxType> => [
  {
    variant: 'Planet',
    title: translateMessage('addingResources_title'),
    subtitle: translateMessage('addingResources_subtitle'),
    href: 'https://adminjs.co/tutorial-passing-resources.html',
  },
];

const Card = styled(Box)`
  display: ${({ flex }): string => (flex ? 'flex' : 'block')};
  color: ${({ theme }) => theme.colors.grey100};
  height: 100%;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.space.md};
  transition: all 0.1s ease-in;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary100};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

Card.defaultProps = {
  variant: 'container',
  boxShadow: 'card',
};

export const Dashboard: React.FC = () => {
  const { translateMessage, translateButton } = useTranslation();

  const [data, setData] = useState([]);
  const api = new ApiClient();

  const [time, setTime] = useState(7);

  useEffect(() => {
    api
      .getDashboard({ params: { time: time } })
      .then((response: any) => {
        setData(response.data);
      })
      .catch((error) => {
        // Handle errors here
      });
  }, [time]);

  return (
    <Box>
      <DashboardHeader />
      <Box
        mt={['xl', 'xl', '-100px']}
        mb="xl"
        mx={[0, 0, 0, 'auto']}
        px={['default', 'lg', 'xxl', '0']}
        position="relative"
        flex
        flexDirection="row"
        flexWrap="wrap"
        width={[1, 1, 1, 1024]}
      >
        {boxes({ translateMessage }).map((box, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} width={[1, 1 / 2, 1 / 2, 1 / 3]} p="lg">
            <Card as="a" href={box.href} target="_blank">
              <Text textAlign="center">
                <Illustration
                  variant={box.variant as IllustrationProps['variant']}
                  width={100}
                  height={70}
                />
                <H5 mt="lg">{box.title}</H5>
                <Text>{box.subtitle}</Text>
              </Text>
            </Card>
          </Box>
        ))}
      </Box>

      <Box
        mt={['xl', 'xl']}
        mb="xl"
        mx={[0, 0, 0, 'auto']}
        px={['default', 'lg', 'xxl', '0']}
        position="relative"
        flex
        flexDirection="row"
        flexWrap="wrap"
        width={[1, 1, 1, 1024]}
      >
        <select
          onChange={(e) => setTime(parseInt(e.target.value))}
          style={{ width: '40%' }}
        >
          <option value="90">3 Months</option>
          <option value="30">30 Days</option>
          <option value="15">15 Days</option>
          <option value="7" selected>
            7 Days
          </option>
          <option value="1">1 Days</option>
        </select>
      </Box>

      <Box
        mt={['xl', 'xl']}
        mb="xl"
        mx={[0, 0, 0, 'auto']}
        px={['default', 'lg', 'xxl', '0']}
        position="relative"
        flex
        flexDirection="row"
        flexWrap="wrap"
        width={[1, 1, 1, 1024]}
      >
        {data?.map((item, index) => (
          <Box key={index} width={[1, 1 / 2, 1 / 2, 1 / 2]} p="lg">
            <Card key={index}>
              <H5 mt="lg">{item.resource}</H5>
              <Text>Analytics for your models</Text>
              <ChartItem
                data={item.data}
                barField="count"
                lineField="count"
                areaField="count"
              />
            </Card>
          </Box>
        ))}

        <Card width={1} m="lg">
          <Text textAlign="center">
            <Illustration variant="AdminJSLogo" />
            <H5>{translateMessage('needMoreSolutions_title')}</H5>
            <Text>{translateMessage('needMoreSolutions_subtitle')}</Text>
            <Text mt="xxl">
              <Button
                as="a"
                variant="contained"
                href="https://share.hsforms.com/1IedvmEz6RH2orhcL6g2UHA8oc5a"
                target="_blank"
              >
                {translateButton('contactUs')}
              </Button>
            </Text>
          </Text>
        </Card>
      </Box>
    </Box>
  );
};

export const dashboardHandler = async (request, response, context) => {
  const timeDays = request.query['time'];
  const resourcesData = await Promise.all(
    context._admin.resources.map(async (resource) => {
      const sevenDaysAgo = moment().subtract(timeDays, 'days').toDate();
      const filter = {
        createdAt: {
          $gte: sevenDaysAgo,
        },
      };

      const aggregatedData = await resource.MongooseModel.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      const last7Days = [];
      let currentDate = moment().subtract(timeDays, 'days');
      while (currentDate <= moment()) {
        last7Days.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'days');
      }

      const allData = last7Days.map((date) => {
        const dataForDate = aggregatedData.find((item) => item._id === date);
        return {
          date: date,
          count: dataForDate ? dataForDate.count : 0,
        };
      });

      return {
        resource: resource.name(),
        data: allData,
      };
    }),
  );

  return resourcesData;
};

export default Dashboard;
