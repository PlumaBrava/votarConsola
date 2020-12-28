export const xmlRetrieveEmployeesByCriteriaEx=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveEmployeesByCriteriaEx>
         <!--Optional:-->
         <tran:criteria>
            <!--Optional:-->
            <!--type: string-->
            <tran:regionID>((SUCURSAL))</tran:regionID>
            <!--Optional:-->
            <!--type: string-->
            <tran:employeeType></tran:employeeType>
            <!--Optional:-->
            <!--type: string-->
            <tran:employeeID></tran:employeeID>
            <!--Optional:-->
            <!--type: string-->
            <tran:lastName></tran:lastName>
            <!--Optional:-->
            <!--type: string-->
            <tran:firstName></tran:firstName>
            <!--Optional:-->
            <!--type: string-->
            <tran:middleName></tran:middleName>
            <!--Optional:-->
            <!--type: string-->
            <tran:employeeStatus></tran:employeeStatus>
         </tran:criteria>
         <!--Optional:-->
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
            <!--type: boolean-->
            <tran:includeEmployeeLocations>false</tran:includeEmployeeLocations>
         </tran:options>
      </tran:RetrieveEmployeesByCriteriaEx>
   </soapenv:Body>
</soapenv:Envelope>`;
