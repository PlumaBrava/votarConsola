export const xmlRetrieveRoutingSessionsByCriteria=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveRoutingSessionsByCriteria>
         <!--Optional:-->
         <tran:criteria>
            <!--Optional:-->
            <!--type: string-->
            <tran:regionIdentity>((SUCURSAL))</tran:regionIdentity>
            <!--Optional:-->
            <!--type: date-->
            <tran:dateStart>((FECHA_DESDE))</tran:dateStart>
            <!--Optional:-->
            <!--type: date-->
            <tran:dateEnd>((FECHA_HASTA))</tran:dateEnd>
            <!--Optional:-->
            <!--type: string-->
            <tran:scenario></tran:scenario>
            <!--Optional:-->
            <!--type: string-->
            <tran:description></tran:description>
         </tran:criteria>
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
            <!--type: RoutingDetailLevel - enumeration: [rdlSession,rdlRoute,rdlStop,rdlOrder,rdlLineItem]-->
            <tran:level>rdlSession</tran:level>
            <!--type: boolean-->
            <tran:retrieveActivities>false</tran:retrieveActivities>
            <!--type: boolean-->
            <tran:retrieveEquipment>true</tran:retrieveEquipment>
            <!--type: boolean-->
            <tran:retrieveActive>false</tran:retrieveActive>
            <!--type: boolean-->
            <tran:retrieveBuilt>true</tran:retrieveBuilt>
            <!--type: boolean-->
            <tran:retrievePublished>true</tran:retrievePublished>
            <tran:timeZoneOptions>
               <!--type: boolean-->
               <tran:embeddedInTimestamp>true</tran:embeddedInTimestamp>
               <!--type: TimeZoneOptionsType - enumeration: [tzoGMT,tzoLocalTimeZone,tzoFixedTimeZone]-->
               <tran:optionType>tzoGMT</tran:optionType>
               <!--type: TimeZoneValue - enumeration: [tmzNone,tmzAzoresCapeVerdeIs,tmzMidAtlantic,tmzBrasilia,tmzBuenosAiresGeorgetown,tmzNewfoundland,tmzAtlanticTimeCanada,tmzLaPaz,tmzBogotaLima,tmzEasternTimeUSCanada,tmzIndianaEast,tmzCentralTimeUSCanada,tmzMexicoCityTegucigalpa,tmzSaskatchewan,tmzArizona,tmzMountainTimeUSCanada,tmzPacificTimeUSCanada,tmzAlaska,tmzHawaii,tmzMidwayIslandSamoa,tmzEniwetokKwajalein,tmzDublinEdinburghLondonLisbon,tmzMonroviaCasablanca,tmzBerlinStockholmRomeBernBrusselsVienna,tmzParisMadridAmsterdam,tmzPragueWarsawBudapest,tmzAthensHelsinkiIstanbul,tmzCairo,tmzEasternEurope,tmzHararePretoria,tmzIsrael,tmzBaghdadKuwaitNairobiRiyadh,tmzMoscowStPetersburgKazanVolgograd,tmzTehran,tmzAbuDhabiMuscatTbilisi,tmzKabul,tmzIslamabadKarachiEkaterinburgTashkent,tmzBombayCalcuttaMadrasNewDelhiColombo,tmzAlmatyDhaka,tmzBangkokJakartaHanoi,tmzBeijingChongqingUrumqi,tmzHongKongPerthSingaporeTaipei,tmzTokyoOsakaSapporoSeoulYakutsk,tmzAdelaide,tmzDarwin,tmzMelbourneSydney,tmzGuamPortMoresbyVladivostok,tmzHobart,tmzMagadanSolomonIsNewCaledonia,tmzFijiKamchatkaMarshallIs,tmzWellingtonAuckland,tmzTijuanaBaja,tmzBrisbane,tmzCaracas,tmzAsuncion,tmzSamaraIzhevsk,tmzNovosibirskOmsk,tmzKrasnoyarskNovokuznetsk,tmzIrkutsk,tmzYakutskChita,tmzCentralAmerica]-->
               <tran:timeZone>tmzNone</tran:timeZone>
            </tran:timeZoneOptions>
         </tran:options>
      </tran:RetrieveRoutingSessionsByCriteria>
   </soapenv:Body>
</soapenv:Envelope>`;
