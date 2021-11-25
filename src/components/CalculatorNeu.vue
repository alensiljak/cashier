<template lang="pug">
  .calculator
    .calculator__container
      .display
          input#display.display-numbers(:value="current||'0'" disabled)
      .keyboard
        .keyboard-row
          button.keyboard-key.keyboard-key--gray(@click="clearDisplay()") AC
          button.keyboard-key.keyboard-key--gray(@click="changeSign()") #[span +/-]
          button.keyboard-key.keyboard-key--gray(@click="convertPercent()") %
          button.operator.keyboard-key.keyboard-key--orange(@click="handleOperator('÷')") ÷
        .keyboard-row
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('7')") 7
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('8')") 8
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('9')") 9
          button.operator.keyboard-key.keyboard-key--orange(@click="handleOperator('×')") ×
        .keyboard-row
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('4')") 4
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('5')") 5
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('6')") 6
          button.operator.keyboard-key.keyboard-key--orange(@click="handleOperator('-')") −
        .keyboard-row
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('1')") 1
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('2')") 2
          button.number.keyboard-key.keyboard-key--white(@click="appendSymbol('3')") 3
          button.operator.keyboard-key.keyboard-key--orange(@click="handleOperator('+')") +
        .keyboard-row
          button.keyboard-key.keyboard-key--white.keyboard-key--double(@click="appendSymbol('0')") 0
          button.keyboard-key.keyboard-key--white(@click="convertDecimal()") .
          button.keyboard-key.keyboard-key--orange(@click="handleOperator('=')") =

</template>
<script>
export default {
  data () {
    return {
      current: '',
      previous: null,
      operator: null,
      clickedOperator: false
    }
  },
  methods: {
    clearDisplay () {
      this.current = ''
      this.previous = null
      this.operator = null
      this.clickedOperator = false
    },
    appendSymbol (number) {
      if (this.clickedOperator) {
        this.clickedOperator = false
        this.current = number
      } else {
        this.current = this.current === '0' ? number : `${this.current}${number}`
      }
    },
    convertDecimal () {
      if (this.clickedOperator) {
        this.current = '0.'
        this.clickedOperator = false
      }
      if (this.current.indexOf('.') === -1) {
        this.current += '0.'
      }
    },
    changeSign () {
      this.current = this.current.charAt(0) === '-' ? this.current.slice(1) : `-${this.current}`
    },
    convertPercent () {
      this.current = `${parseFloat(this.current) / 100}`
    },
    handleOperator (newOperator) {
      const numberValue = parseFloat(this.current)
      if (this.operator && this.clickedOperator) {
        this.operator = newOperator
      }
      if (this.previous == null) {
        this.previous = numberValue
      } else if (this.operator) {
        const result = this.calculate(this.previous, numberValue, this.operator)
        this.current = String(result)
        this.previous = result
      }
      this.clickedOperator = true
      this.operator = newOperator
    },
    calculate (first, second, operator) {
      switch (operator) {
        case '+':
          return first + second
        case '-':
          return first - second
        case '×':
          return first * second
        case '÷':
          return first / second
        default:
          return second
      }
    }
  }
}
</script>
<style lang="scss">
@import "@/sass/app.scss";
  .calculator{
    margin: 2rem 0;
    &__container{
      width: 100%;
      padding: 1rem;
      border-radius: 36px;
      background: var(--background-calculator);
      @include screen(mobile-big){
        width: 375px;
        display: block;
        margin: 0 auto;
      }
      .display{
        padding: 2rem 1rem;
        display: flex;
        justify-content: flex-end;
        &-numbers{
          font-size: 4rem;
          color: var(--key);
          text-align: right;
          width: 100%;
        }
      }
      .keyboard{
        &-row{
          display: flex;
          justify-content: center;
          flex-direction: row;
          align-items: space-around;
        }
        &-key{
          display: flex;
          justify-content: center;
          align-items: center;
          appearance: none;
          margin: .5rem .5rem;
          width: 65.9px;
          min-width: 65.9px;
          padding: 1.24rem 0.91rem ;
          border-radius: 2rem;
          @extend .box-shadow;
          background-color: var(--background-calculator);
          font-size: 2rem;
          &:hover {
            cursor: pointer;
          }
          &:active{
            @extend .pressed;
          }
          span{
            font-size: 1.7rem;
          }
          &--double{
            width: 150px;
          }
          &--gray{
            color: var(--key-gray);
          }
          &--orange{
            color: var(--key-orange);
          }
          &--white{
            color: var(--key);
          }
          @include down-screen(mobile-small){
            width: 50px;
            min-width: 50px;
            font-size: 1.2rem;
          }
        }
      }
    }
  }
</style>
