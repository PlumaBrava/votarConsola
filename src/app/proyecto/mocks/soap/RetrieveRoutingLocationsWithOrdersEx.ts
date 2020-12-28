export const xmlRetrieveRoutingLocationsWithOrdersEx=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveRoutingLocationsWithOrdersEx>
         <!--Optional:-->
         <tran:sessionIdentity>
            <!--Optional:-->
            <!--type: string-->
            <tran:regionID>REG_01</tran:regionID>
            <!--type: int-->
            <tran:internalSessionID>2945</tran:internalSessionID>
         </tran:sessionIdentity>
         <!--Optional:-->
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
            <!--type: boolean-->
            <tran:retrieveConsigneeHistory>false</tran:retrieveConsigneeHistory>
            <!--type: boolean-->
            <tran:retrieveTimeWindowOverrides>true</tran:retrieveTimeWindowOverrides>
            <!--type: boolean-->
            <tran:retrieveServiceTimeOverrides>true</tran:retrieveServiceTimeOverrides>
            <!--type: boolean-->
            <tran:retrieveLocationPreferences>false</tran:retrieveLocationPreferences>
            <!--type: boolean-->
            <tran:retrieveActiveAlerts>false</tran:retrieveActiveAlerts>
            <!--type: boolean-->
            <tran:retrieveLocationEquipmentTypes>false</tran:retrieveLocationEquipmentTypes>
            <!--type: boolean-->
            <tran:retrieveEmployeeAssignments>false</tran:retrieveEmployeeAssignments>
         </tran:options>
      </tran:RetrieveRoutingLocationsWithOrdersEx>
   </soapenv:Body>
</soapenv:Envelope>`;
