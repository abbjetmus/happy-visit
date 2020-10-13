<template>
    <div>
      <div style="width: 800px; padding-bottom: 0;">
        <bar-chart-component :chartData="chartData" :options="options"></bar-chart-component>
      </div>
      <div style="width: 800px; padding-top: 0;">
        <span id="alien" class="col-auto text-h4" style="margin-left: 38px;">&#128125;</span>
        <span id="angry" class="col-auto text-h4" style="margin-left: 25px;">&#128545;</span>
        <span id="clown" class="col-auto text-h4" style="margin-left: 25px;">&#129313;</span>
        <span id="cry" class="col-auto text-h4" style="margin-left: 24px;">&#128546;</span>
        <span id="excited" class="col-auto text-h4" style="margin-left: 24px;">&#129321;</span>
        <span id="happy" class="col-auto text-h4" style="margin-left: 24px;">&#128578;</span>
        <span id="heart_eyes" class="col-auto text-h4" style="margin-left: 24px;">&#128525;</span>
        <span id="neutral" class="col-auto text-h4" style="margin-left: 24px;">&#128528;</span>
        <span id="sad" class="col-auto text-h4" style="margin-left: 24px;">&#128543;</span>
        <span id="silly" class="col-auto text-h4" style="margin-left: 24px;">&#129322;</span>
      </div>
    </div>
</template>

<script>
import { db } from '../boot/firebase.js'
const happydays = db.collection('happydays')

import BarChartComponent from '../components/BarChartComponent.vue'
export default {
  name: 'happy-chart-component',
  components: {
    BarChartComponent
  },
  props: {
    currentdate: { required: true, type: String }
  },
  data () {
    return {
      document: null,
      dateOptions: [this.currendate],
      chartData: {
        datasets: [{
          label: 'Bar Chart',
          borderWidth: 1,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          pointBorderColor: '#2554FF',
          data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  watch: {
    currentdate: {
      // call it upon creation too
      immediate: true,
      handler (currentdate) {
        if (currentdate != null) {
          this.$bind('document', happydays.doc(currentdate)).then(val => {
            if (val != null) {
              delete val.date
              const sorted = Object.entries(val).sort((a, b) => {
                return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0
              })
              const values = sorted.map(el => el[1])

              this.chartData = {
                datasets: [{
                  labels: ['', '', '', '', '', '', '', '', '', '', ''],
                  borderWidth: 1,
                  backgroundColor: 'rgba(255, 206, 86, 0.2)',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  pointBorderColor: '#2554FF',
                  data: values,
                  order: 2
                }]
              }
            }
          })
        }
      }
    },
    document: function (val) {
      if (val != null) {
        delete val.date
        const sorted = Object.entries(val).sort((a, b) => {
          return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0
        })
        // const keys = sorted.map(el => el[0])
        const values = sorted.map(el => el[1])

        this.chartData = {
          labels: ['', '', '', '', '', '', '', '', '', '', ''],
          datasets: [{
            borderWidth: 1,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            pointBorderColor: '#2554FF',
            data: values,
            order: 2
          }]
        }
      }
    }
  }
}
</script>
