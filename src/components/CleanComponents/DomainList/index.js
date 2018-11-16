import React from 'react';
import { Table } from 'antd';

const dataSource = [{
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street'
  }, {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street'
  }];
  
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  }];

class DomainList extends React.Component {
    render() {
        return (
            <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div className="utils__title">Recently Referrals</div>
                <div className="utils__titleDescription">
                  Block with important Recently Referrals information
                </div>
              </div>
              <div className="card-body">
                <Table dataSource={dataSource} columns={columns} />
              </div>
            </div>
          </div>
        </div>
        )
    }
}
export default DomainList;

