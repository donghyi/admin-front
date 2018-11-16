import React from 'react';
import Page from 'components/LayoutComponents/Page';
import DomainList from 'components/CleanComponents/DomainList';
import Helmet from 'react-helmet';

class DomainListPage extends React.Component {

    static defaultProps = {
        pathName: 'Domain List Page',
        roles: ['agent', 'administrator'],
      }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Domain List Page" />
        <DomainList/>
      </Page>
    )
  }
}

export default DomainListPage
