export const xmlRetrieveEquipmentByCriteria=`
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <tran:RetrieveEquipmentByCriteria>
         <!--Optional:-->
         <tran:criteria>
            <!--Optional:-->
            <!--type: string-->
            <tran:regionID>((SUCURSAL))</tran:regionID>
            <!--Optional:-->
            <!--type: string-->
            <tran:equipmentType></tran:equipmentType>
            <!--Optional:-->
            <!--type: string-->
            <tran:equipmentID>((ID_VEHICULO))</tran:equipmentID>
            <!--Optional:-->
            <!--type: string-->
            <tran:gpsUnitID></tran:gpsUnitID>
            <!--Optional:-->
            <!--type: string-->
            <tran:equipmentStatus></tran:equipmentStatus>
         </tran:criteria>
         <!--Optional:-->
         <tran:options>
            <!--type: boolean-->
            <tran:applyRoadnetAnywhereSyncRules>false</tran:applyRoadnetAnywhereSyncRules>
            <tran:timeZoneOptions>
               <!--type: boolean-->
               <tran:embeddedInTimestamp>true</tran:embeddedInTimestamp>
               <!--type: TimeZoneOptionsType - enumeration: [tzoGMT,tzoLocalTimeZone,tzoFixedTimeZone]-->
               <tran:optionType>tzoGMT</tran:optionType>
               <!--type: TimeZoneValue - enumeration: [tmzNone,tmzAzoresCapeVerdeIs,tmzMidAtlantic,tmzBrasilia,tmzBuenosAiresGeorgetown,tmzNewfoundland,tmzAtlanticTimeCanada,tmzLaPaz,tmzBogotaLima,tmzEasternTimeUSCanada,tmzIndianaEast,tmzCentralTimeUSCanada,tmzMexicoCityTegucigalpa,tmzSaskatchewan,tmzArizona,tmzMountainTimeUSCanada,tmzPacificTimeUSCanada,tmzAlaska,tmzHawaii,tmzMidwayIslandSamoa,tmzEniwetokKwajalein,tmzDublinEdinburghLondonLisbon,tmzMonroviaCasablanca,tmzBerlinStockholmRomeBernBrusselsVienna,tmzParisMadridAmsterdam,tmzPragueWarsawBudapest,tmzAthensHelsinkiIstanbul,tmzCairo,tmzEasternEurope,tmzHararePretoria,tmzIsrael,tmzBaghdadKuwaitNairobiRiyadh,tmzMoscowStPetersburgKazanVolgograd,tmzTehran,tmzAbuDhabiMuscatTbilisi,tmzKabul,tmzIslamabadKarachiEkaterinburgTashkent,tmzBombayCalcuttaMadrasNewDelhiColombo,tmzAlmatyDhaka,tmzBangkokJakartaHanoi,tmzBeijingChongqingUrumqi,tmzHongKongPerthSingaporeTaipei,tmzTokyoOsakaSapporoSeoulYakutsk,tmzAdelaide,tmzDarwin,tmzMelbourneSydney,tmzGuamPortMoresbyVladivostok,tmzHobart,tmzMagadanSolomonIsNewCaledonia,tmzFijiKamchatkaMarshallIs,tmzWellingtonAuckland,tmzTijuanaBaja,tmzBrisbane,tmzCaracas,tmzAsuncion,tmzSamaraIzhevsk,tmzNovosibirskOmsk,tmzKrasnoyarskNovokuznetsk,tmzIrkutsk,tmzYakutskChita,tmzCentralAmerica]-->
               <tran:timeZone>tmzNone</tran:timeZone>
            </tran:timeZoneOptions>
         </tran:options>
      </tran:RetrieveEquipmentByCriteria>
   </soapenv:Body>
</soapenv:Envelope>`;
