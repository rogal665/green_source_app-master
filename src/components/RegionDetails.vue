<template>
  <div v-if="selectedRegionData.country_code" class="details-container">
    <a href="#" @click.prevent="closeRegionDetails" class="x-close-btn">
      <div class="x-line"></div>
      <div class="x-line"></div>
    </a>
    <h3>{{ selectedCountry }}</h3>

    <div class="summary" v-show="!showDetails">
      <p><strong>Wind+Sun Electricity Generation Forecast: {{ displayCurrentTotalPower }} GW<br>{{ displayTime }} [UTC]</strong></p>
      <table class="general">
        <thead>
          <tr>
            <th>Ratio to Avg-High Wind+Sun Generation</th>
            <th>Ratio to Avg-High total electricity demand</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td @click="toggleRatioToLoad" class="marker" :class="{ active: !ratioToLoad }" :style="'background-color:' + ratioToAvgGeneration.color">{{ ratioToAvgGeneration.label }} [{{ displayCurrentRatioWindAndSolarToItsSumPower }}%]</td>
            <td @click="toggleRatioToLoad" class="marker" :class="{ active: ratioToLoad }" :style="'background-color:' + ratioToTotalLoad.color">{{ ratioToTotalLoad.label }} [{{ displayCurrentRatioWindAndSolarToTotalLoad }}%]</td>
          </tr>
          <tr>
            <td><label>Map: <input type="radio" v-model="ratioToLoad" name="map" :value="false"></label></td>
            <td><label>Map: <input type="radio" v-model="ratioToLoad" name="map" :value="true"></label></td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th colspan="2">Details by source:</th>
          </tr>
          <tr>
            <th>Wind</th>
            <th>Solar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="marker" :style="'background-color:' + ratioToWindAvgGeneration.color">{{ ratioToWindAvgGeneration.label }} [{{ displayCurrentRatioWindToInstalledWindPower }}%]</td>
            <td class="marker" :style="'background-color:' + ratioToSolarAvgGeneration.color">{{ ratioToSolarAvgGeneration.label }} [{{ displayCurrentRatioSolarToInstalledSolarPower }}%]</td>
          </tr>
          <tr>
            <td>{{ displayCurrentWindPower }} GW</td>
            <td>{{ displayCurrentSolarPower }} GW</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="datails" v-show="showDetails">
      <table class="general">
        <thead>
          <tr>
            <th colspan="3">Wind+Sun Electricity Generation Forecast:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Date and Time:</td>
            <td colspan="2">{{ displayTime }} [UTC]</td>
          </tr>
          <tr>
            <td>Forecasted Value:</td>
            <td colspan="2">{{ displayCurrentTotalPower }} GW</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>Ratio to</th>
            <th>Wind+Sun Generation</th>
            <th>Total Electricity demand</th>
          </tr>
          <tr>
            <td>Average High Daily Value:</td>
            <td>&#772;x = {{ totalCapacity }}</td>
            <td>&#772;x = {{ totalLoad }}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="names">Generation level:</td>
            <td @click="toggleRatioToLoad" class="marker" :class="{ active: !ratioToLoad }" :style="'background-color:' + ratioToAvgGeneration.color">{{ ratioToAvgGeneration.label }} [{{ displayCurrentRatioWindAndSolarToItsSumPower }}%]</td>
            <td @click="toggleRatioToLoad" class="marker" :class="{ active: ratioToLoad }" :style="'background-color:' + ratioToTotalLoad.color">{{ ratioToTotalLoad.label }} [{{ displayCurrentRatioWindAndSolarToTotalLoad }}%]</td>
          </tr>
          <tr>
            <td>Show on Map</td>
            <td><input type="radio" v-model="ratioToLoad" name="map2" :value="false"></td>
            <td><input type="radio" v-model="ratioToLoad" name="map2" :value="true"></td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th colspan="3">Details by source of electricity:</th>
          </tr>
          <tr>
            <th>Source:</th>
            <th>Wind</th>
            <th>Sun</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Forecasted Level:</td>
            <td class="marker" :style="'background-color:' + ratioToWindAvgGeneration.color">{{ ratioToWindAvgGeneration.label }} [{{ displayCurrentRatioWindToInstalledWindPower }}%]</td>
            <td class="marker" :style="'background-color:' + ratioToSolarAvgGeneration.color">{{ ratioToSolarAvgGeneration.label }} [{{ displayCurrentRatioSolarToInstalledSolarPower }}%]</td>
          </tr>
          <tr>
            <td>Forecasted Value:</td>
            <td>{{ displayCurrentWindPower }} GW</td>
            <td>{{ displayCurrentSolarPower }} GW</td>
          </tr>
          <tr>
            <td>Average High Single Value:</td>
            <td>&#772;x = {{ windCapacity }} GW</td>
            <td>&#772;x = {{ solarCapacity }} GW</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-center">
      <button class="btn" :class="{ 'active': showDetails }" @click.prevent="toggleDetails"><span class="triangle"></span>Show <span class="summary">Summary</span><span class="details">Details</span></button>
    </p>

  </div>
</template>

<script>
import "@/main.scss";
import { naiveRound } from '../services/utils.js';
import { transformPercentToText } from '../services/utils.js';

export default {
  name: "RegionDetails",
  props: {
    totalCapacities: {},
    selectedRegionData: {},
    selectedTime: null
  },
  watch: {
    selectedRegionData(selectedRegionData) {
      this.selectedCountry = this.countriesCodes[selectedRegionData.country_code];
      this.recalcForecastdetails();
    },
    selectedTime () {
      this.recalcForecastdetails();
    }
  },
  data() {
    return {
      showDetails: false,
      selectedCountry: "",
      displayTime: 0,
      ratioToAvgGeneration: "",
      ratioToTotalLoad: "",
      ratioToWindAvgGeneration: "",
      ratioToSolarAvgGeneration: "",
      displayCurrentWindPower: 0,
      displayCurrentSolarPower: 0,
      displayCurrentTotalPower: 0,
      displayCurrentRatioWindToInstalledWindPower: 0,
      displayCurrentRatioSolarToInstalledSolarPower: 0,
      displayCurrentRatioWindAndSolarToItsSumPower: 0,
      displayCurrentRatioWindAndSolarToTotalLoad: 0,
      countriesCodes: {
        AF: "Afghanistan",
        AX: "Aland Islands",
        AL: "Albania",
        DZ: "Algeria",
        AS: "American Samoa",
        AD: "Andorra",
        AO: "Angola",
        AI: "Anguilla",
        AQ: "Antarctica",
        AG: "Antigua And Barbuda",
        AR: "Argentina",
        AM: "Armenia",
        AW: "Aruba",
        AU: "Australia",
        AT: "Austria",
        AZ: "Azerbaijan",
        BS: "Bahamas",
        BH: "Bahrain",
        BD: "Bangladesh",
        BB: "Barbados",
        BY: "Belarus",
        BE: "Belgium",
        BZ: "Belize",
        BJ: "Benin",
        BM: "Bermuda",
        BT: "Bhutan",
        BO: "Bolivia",
        BA: "Bosnia And Herzegovina",
        BW: "Botswana",
        BV: "Bouvet Island",
        BR: "Brazil",
        IO: "British Indian Ocean Territory",
        BN: "Brunei Darussalam",
        BG: "Bulgaria",
        BF: "Burkina Faso",
        BI: "Burundi",
        KH: "Cambodia",
        CM: "Cameroon",
        CA: "Canada",
        CV: "Cape Verde",
        KY: "Cayman Islands",
        CF: "Central African Republic",
        TD: "Chad",
        CL: "Chile",
        CN: "China",
        CX: "Christmas Island",
        CC: "Cocos (Keeling) Islands",
        CO: "Colombia",
        KM: "Comoros",
        CG: "Congo",
        CD: "Congo, Democratic Republic",
        CK: "Cook Islands",
        CR: "Costa Rica",
        CI: 'Cote D"Ivoire',
        HR: "Croatia",
        CU: "Cuba",
        CY: "Cyprus",
        CZ: "Czech Republic",
        DK: "Denmark",
        DJ: "Djibouti",
        DM: "Dominica",
        DO: "Dominican Republic",
        EC: "Ecuador",
        EG: "Egypt",
        SV: "El Salvador",
        GQ: "Equatorial Guinea",
        ER: "Eritrea",
        EE: "Estonia",
        ET: "Ethiopia",
        FK: "Falkland Islands (Malvinas)",
        FO: "Faroe Islands",
        FJ: "Fiji",
        FI: "Finland",
        FR: "France",
        GF: "French Guiana",
        PF: "French Polynesia",
        TF: "French Southern Territories",
        GA: "Gabon",
        GM: "Gambia",
        GE: "Georgia",
        DE: "Germany",
        GH: "Ghana",
        GI: "Gibraltar",
        GR: "Greece",
        GL: "Greenland",
        GD: "Grenada",
        GP: "Guadeloupe",
        GU: "Guam",
        GT: "Guatemala",
        GG: "Guernsey",
        GN: "Guinea",
        GW: "Guinea-Bissau",
        GY: "Guyana",
        HT: "Haiti",
        HM: "Heard Island & Mcdonald Islands",
        VA: "Holy See (Vatican City State)",
        HN: "Honduras",
        HK: "Hong Kong",
        HU: "Hungary",
        IS: "Iceland",
        IN: "India",
        ID: "Indonesia",
        IR: "Iran, Islamic Republic Of",
        IQ: "Iraq",
        IE: "Ireland",
        IM: "Isle Of Man",
        IL: "Israel",
        IT: "Italy",
        JM: "Jamaica",
        JP: "Japan",
        JE: "Jersey",
        JO: "Jordan",
        KZ: "Kazakhstan",
        KE: "Kenya",
        KI: "Kiribati",
        KR: "Korea",
        KP: "North Korea",
        KW: "Kuwait",
        KG: "Kyrgyzstan",
        LA: 'Lao People"s Democratic Republic',
        LV: "Latvia",
        LB: "Lebanon",
        LS: "Lesotho",
        LR: "Liberia",
        LY: "Libyan Arab Jamahiriya",
        LI: "Liechtenstein",
        LT: "Lithuania",
        LU: "Luxembourg",
        MO: "Macao",
        MK: "Macedonia",
        MG: "Madagascar",
        MW: "Malawi",
        MY: "Malaysia",
        MV: "Maldives",
        ML: "Mali",
        MT: "Malta",
        MH: "Marshall Islands",
        MQ: "Martinique",
        MR: "Mauritania",
        MU: "Mauritius",
        YT: "Mayotte",
        MX: "Mexico",
        FM: "Micronesia, Federated States Of",
        MD: "Moldova",
        MC: "Monaco",
        MN: "Mongolia",
        ME: "Montenegro",
        MS: "Montserrat",
        MA: "Morocco",
        MZ: "Mozambique",
        MM: "Myanmar",
        NA: "Namibia",
        NR: "Nauru",
        NP: "Nepal",
        NL: "Netherlands",
        AN: "Netherlands Antilles",
        NC: "New Caledonia",
        NZ: "New Zealand",
        NI: "Nicaragua",
        NE: "Niger",
        NG: "Nigeria",
        NU: "Niue",
        NF: "Norfolk Island",
        MP: "Northern Mariana Islands",
        NO: "Norway",
        OM: "Oman",
        PK: "Pakistan",
        PW: "Palau",
        PS: "Palestinian Territory, Occupied",
        PA: "Panama",
        PG: "Papua New Guinea",
        PY: "Paraguay",
        PE: "Peru",
        PH: "Philippines",
        PN: "Pitcairn",
        PL: "Poland",
        PT: "Portugal",
        PR: "Puerto Rico",
        QA: "Qatar",
        RE: "Reunion",
        RO: "Romania",
        RU: "Russian Federation",
        RW: "Rwanda",
        BL: "Saint Barthelemy",
        SH: "Saint Helena",
        KN: "Saint Kitts And Nevis",
        LC: "Saint Lucia",
        MF: "Saint Martin",
        PM: "Saint Pierre And Miquelon",
        VC: "Saint Vincent And Grenadines",
        WS: "Samoa",
        SM: "San Marino",
        ST: "Sao Tome And Principe",
        SA: "Saudi Arabia",
        SN: "Senegal",
        RS: "Serbia",
        SC: "Seychelles",
        SL: "Sierra Leone",
        SG: "Singapore",
        SK: "Slovakia",
        SI: "Slovenia",
        SB: "Solomon Islands",
        SO: "Somalia",
        ZA: "South Africa",
        GS: "South Georgia And Sandwich Isl.",
        ES: "Spain",
        LK: "Sri Lanka",
        SD: "Sudan",
        SR: "Suriname",
        SJ: "Svalbard And Jan Mayen",
        SZ: "Swaziland",
        SE: "Sweden",
        CH: "Switzerland",
        SY: "Syrian Arab Republic",
        TW: "Taiwan",
        TJ: "Tajikistan",
        TZ: "Tanzania",
        TH: "Thailand",
        TL: "Timor-Leste",
        TG: "Togo",
        TK: "Tokelau",
        TO: "Tonga",
        TT: "Trinidad And Tobago",
        TN: "Tunisia",
        TR: "Turkey",
        TM: "Turkmenistan",
        TC: "Turks And Caicos Islands",
        TV: "Tuvalu",
        UG: "Uganda",
        UA: "Ukraine",
        AE: "United Arab Emirates",
        GB: "United Kingdom",
        US: "United States",
        UM: "United States Outlying Islands",
        UY: "Uruguay",
        UZ: "Uzbekistan",
        VU: "Vanuatu",
        VE: "Venezuela",
        VN: "Vietnam",
        VG: "Virgin Islands, British",
        VI: "Virgin Islands, U.S.",
        WF: "Wallis And Futuna",
        EH: "Western Sahara",
        YE: "Yemen",
        ZM: "Zambia",
        ZW: "Zimbabwe",
      },
    };
  },
  methods: {
    toggleRatioToLoad () {
      this.ratioToLoad = !this.ratioToLoad;
    },
    toggleDetails () {
      this.showDetails = !this.showDetails;
    },
    closeRegionDetails () {
      this.$emit('close-region-details');
    },
    recalcForecastdetails () {
      const currentObj = this.storeData.find((item) => {
        return item.country_code === this.selectedRegionData.country_code && item.time_iso === this.selectedTime;
      });

      if(currentObj) {
        this.displayTime = currentObj.time;
        this.displayCurrentWindPower = naiveRound(Math.round(currentObj.wind_power) / 1000, 1);
        this.displayCurrentWindPower = this.displayCurrentWindPower < 0 ? 0 : this.displayCurrentWindPower;

        this.displayCurrentSolarPower = naiveRound(Math.round(currentObj.solar_power) / 1000, 1);
        this.displayCurrentSolarPower = this.displayCurrentSolarPower < 0 ? 0 : this.displayCurrentSolarPower;

        this.displayCurrentTotalPower = naiveRound(this.displayCurrentWindPower + this.displayCurrentSolarPower);

        this.displayCurrentRatioWindToInstalledWindPower = naiveRound((this.displayCurrentWindPower / this.windCapacity) * 100, 1);
        this.displayCurrentRatioSolarToInstalledSolarPower = naiveRound((this.displayCurrentSolarPower / this.solarCapacity) * 100, 1);
        this.displayCurrentRatioWindAndSolarToItsSumPower = naiveRound(((this.displayCurrentWindPower + this.displayCurrentSolarPower) / this.totalCapacity) * 100, 1);
        this.displayCurrentRatioWindAndSolarToTotalLoad = naiveRound(((this.displayCurrentWindPower + this.displayCurrentSolarPower) / this.totalLoad) * 100, 1);
        
        this.ratioToAvgGeneration = transformPercentToText(this.displayCurrentRatioWindAndSolarToItsSumPower);
        this.ratioToTotalLoad = transformPercentToText(this.displayCurrentRatioWindAndSolarToTotalLoad);

        this.ratioToWindAvgGeneration = transformPercentToText(this.displayCurrentWindPower);
        this.ratioToSolarAvgGeneration = transformPercentToText(this.displayCurrentSolarPower);

        document.querySelector(`#text-power-${this.selectedRegionData.country_code}`).textContent = naiveRound(this.displayCurrentWindPower + this.displayCurrentSolarPower) + ' GW';
        document.querySelector(`#text-ratio-${this.selectedRegionData.country_code}`).textContent = this.displayCurrentRatioWindAndSolarToItsSumPower + '%';
      }
    }
  },
  computed: {
    windCapacity () {
      return this.selectedRegionData.wind_capacity_avg_high / 1000;
    },
    solarCapacity () {
      return this.selectedRegionData.solar_capacity_avg_high / 1000;
    },
    storeData() {
      return this.$store.getters.getData;
    },
    totalCapacity () {
      return this.selectedRegionData.total_capacity_avg_high / 1000;
    },
    totalLoad () {
      return this.selectedRegionData.total_load_avg_high / 1000;
    },
    ratioToLoad: {
      get () {
        return this.$store.getters.getIsRatioToLoad;
      },
      set (value) {
        this.$store.commit("setIsRatioToLoad", value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .btn {
    .details {
      display: inline;
    }
    .summary {
      display: none;
    }
  }
  .btn.active {
    .triangle {
      transform: rotate(180deg);
    }
    .details {
      display: none;
    }
    .summary {
      display: inline;
    }
  }
</style>
