import { getCompaniesHouseDataMock } from './getCompaniesHouseDataMock';

const newPerson = (companyName) => {
  return {
    clientName: companyName,
    clientReference: Math.floor(Math.random() * 100000000),
    facilityType: ['Hospital', 'Accountant', 'Software', 'Other'][
      Math.floor(Math.random() * 4)
    ],
    facilityLimit: Math.floor(Math.random() * 100000).toString(),
    grossSalesLedger: Math.floor(Math.random() * 30000).toString(),
    approvedSalesLedger: Math.floor(Math.random() * 10000).toString(),
    currentBalance: Math.floor(Math.random() * 1000).toString(),
  };
};

export default function makeData() {
  const companiesHouseDataMock = getCompaniesHouseDataMock();
  return companiesHouseDataMock.map((d, i) => {
    return {
      ...newPerson(companiesHouseDataMock[i]),
    };
  });
}
