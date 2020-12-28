export const xmlRetrieveEmployeesTypesByCriteriaEx=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveEmployeeTypesByCriteriaEx>
         <!--Optional:-->
         <tran:criteria>
            <!--type: string-->
            <tran:regionId>((SUCURSAL))</tran:regionId>
            <!--Optional:-->
            <!--type: string-->
            <tran:employeeTypeId></tran:employeeTypeId>
         </tran:criteria>
         <!--Optional:-->
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
         </tran:options>
      </tran:RetrieveEmployeeTypesByCriteriaEx>
   </soapenv:Body>
</soapenv:Envelope>`;
