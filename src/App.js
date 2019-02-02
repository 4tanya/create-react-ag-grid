import React, { Component } from 'react';
import './App.scss';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        columnDefs: [
          {
            headerName: "Athlete Details",
            children: [
              {
                headerName: "Athlete", 
                field: "athlete",
                width: 200,
                checkboxSelection: true
              },
              {headerName: "Age", field: "age"},
              {headerName: "Country", field: "country", rowGroup: true, rowGroupIndex: 1, hide: true},
            ]
          },
          {
              headerName: "Sports Results",
              children: [
                  {headerName: "Year", field: "year"},
                  {headerName: "Date", field: "date"},
                  {headerName: "Sport", field: "sport", width: 170, rowGroup: true, rowGroupIndex: 0, hide: true},
                  {headerName: "Gold", field: "gold"},
                  {headerName: "Silver", field: "silver"},
                  {headerName: "Bronze", field: "bronze"},
                  {headerName: "Total", field: "total"}
              ]
          }
        ],
        defaultColDef: {
          width: 90,
          editable: true,
          enableValue: true,
          sortable: true,
          resizable: true,
          filter: true
        },
        defaultGroupSortComparator: function(nodeA, nodeB) {
          if (nodeA.key < nodeB.key) {
            return -1;
          } else if (nodeA.key > nodeB.key) {
            return 1;
          } else {
            return 0;
          }
        },
        paginationPageSize: 15,
        rowBuffer: 15,
        rowSelection: "multiple"
    }
  }

  componentDidMount() {
    fetch("https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json")
      .then(result => result.json())
      .then(rowData => this.updateData(rowData))
  }

  onGridReady = params => {
    this.gridApi = params.api;

    this.updateData = data => {
      this.setState({ rowData: data });
    };
  }

  render() {
    return (
      <div className="c-ag-greed">
        <div className="ag-theme-balham-dark c-ag-greed__table-wrapper">
            <button onClick={this.onButtonClick} className="c-ag-greed__button">Get selected rows</button>
            <div className="c-ag-greed__selected-rows-output"></div>
            <AgGridReact
                columnDefs={this.state.columnDefs}
                defaultColDef={this.state.defaultColDef}
                paginationPageSize={this.state.paginationPageSize}
                pagination={true}
                rowBuffer={this.state.rowBuffer}              
                allowContextMenuWithControlKey={true}
                groupUseEntireRow={true}
                defaultGroupSortComparator={this.state.defaultGroupSortComparator}
                rowSelection={this.state.rowSelection}
                onGridReady={this.onGridReady}
                rowData={this.state.rowData}>
            </AgGridReact>
        </div>
      </div>
    );
  }

  onButtonClick = e => {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map( node => node.data );
    const selectedDataStringPresentation = selectedData.map( 
      node => 'Athlete: ' + node.athlete + ', Sport: ' + node.sport).join('<br/>');
    document.querySelector(".c-ag-greed__selected-rows-output").innerHTML = (!selectedData.length)?
      'No nodes selected'
      : `Selected nodes:<br /> ${selectedDataStringPresentation}`; 
  }
}

export default App;
