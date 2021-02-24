import * as React from 'react'
import './Layout.scss'
import TableManager from '../TableManager/TableManager'

export default function Layout() {
  return (
    <div className='layout-container'>
        <div className="layout-container-header">

        </div>
        <div className="layout-container-body">
            <TableManager />
        </div>
        <div className="layout-container-footer">
            STATUS BAR
        </div>
    </div>
  );
};
