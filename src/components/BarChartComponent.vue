<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  props: {
    chartData: { required: true, type: Object },
    options: { required: true, type: Object }
  },
  data () {
    return {

    }
  }
}
</script>
