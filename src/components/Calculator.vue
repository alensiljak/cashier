<template>
  <div id="calculator">
    <!--  https://github.com/salazarr-js/v-calculator  -->
    <div class="calculator-logs">
      <span v-for="(log, index) in logs" :key="index">{{ log }}</span>
    </div>

    <input type="string" class="calculator-input" v-model="value" @keyup.enter="getResult()" />

    <div class="calculator-row">
      <div class="calculator-col">
        <button class="calculator-btn gray action" @click="clear()">C</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn gray action" @click="del()">del</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn gray action" @click="addExpresion('%')">%</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn accent action" @click="addExpresion('/')">/</button>
      </div>
    </div>
    <div class="calculator-row">
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(7)">7</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(8)">8</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(9)">9</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn accent action" @click="addExpresion('*')">*</button>
      </div>
    </div>
    <div class="calculator-row">
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(4)">4</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(5)">5</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(6)">6</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn accent action" @click="addExpresion('-')">-</button>
      </div>
    </div>
    <div class="calculator-row">
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(1)">1</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(2)">2</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn" @click="addExpresion(3)">3</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn accent action" @click="addExpresion('+')">+</button>
      </div>
    </div>
    <div class="calculator-row">
      <div class="calculator-col wide">
        <button class="calculator-btn" @click="addExpresion(0)">0</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn action" @click="addExpresion('.')">.</button>
      </div>
      <div class="calculator-col">
        <button class="calculator-btn accent action" @click="getResult()">=</button>
      </div>
    </div>
  </div>
</template>

<script>
// https://vuejsexamples.com/a-basic-ios-flavor-calculator-made-with-vuejs/

export default {
  data() {
    return {
      value: 0,
      logs: []
    };
  },
  methods: {
    addExpresion(e) {
      if (Number.isInteger(this.value)) this.value = "";
      this.value += e;
    },
    getResult() {
      let log = this.value;
      this.value = eval(this.value);
      this.logs.push(log + `=${this.value}`);
    },
    clear() {
      this.value = 0;
    },
    del() {
      this.value = this.value.slice(0, -1);
    }
  }
};
</script>

<style lang="scss" scoped>
//  https://github.com/salazarr-js/v-calculator

$darker: #2f2f31;
$dark: #424345;
$gray: #616163;
$white: #fff;
$light: #d4d4d2;
$accent: #f49e3f;

*,
::after,
::before {
  box-sizing: border-box;
}
body {
  margin: 0;
  height: 100vh;
  display: flex;
  font-size: 10px;
  align-items: flex-end;
  justify-content: center;
  background-color: $darker;
}

//  CALCULATOR  \\
#calculator {
  width: 100%;
  margin: 0 auto;
  display: flex;
  padding: 0;
  max-width: 320px;
  min-width: 320px;
  flex-direction: column;
  background-color: $darker;

  .calculator-logs {
    height: 80px;
    display: flex;
    position: relative;
    overflow: hidden;
    align-items: flex-end;
    flex-direction: column;
    justify-content: flex-end;
    &:before {
      top: 0;
      left: 0;
      right: 0;
      height: 48px;
      content: "";
      z-index: 5;
      position: absolute;
      background: linear-gradient(to bottom, $darker, rgba($darker, 0));
    }
    span {
      color: $light;
      opacity: 0.75;
      display: block;
      font-size: 0.8rem;
      text-align: right;
      margin-top: 0.4rem;
      line-height: 1;
      font-weight: lighter;
    }
  }

  .calculator-input {
    color: $light;
    width: 100%;
    border: none;
    padding: 0.8rem;
    display: block;
    font-size: 2.4rem;
    background: none;
    text-align: right;
    font-weight: lighter;
    &:focus,
    &:active {
      outline: none;
    }
  }

  .calculator-row {
    display: flex;
    padding: 0;
    justify-content: space-around;
    .calculator-col {
      flex: 1;
      box-shadow: 0 0 0 1px $darker;
      &.wide {
        flex: 2;
      }
    }
  }

  .calculator-btn {
    width: 100%;
    color: $light;
    border: none;
    cursor: pointer;
    padding: 0.8rem;
    outline: none;
    font-size: 1.6rem;
    transition: all 0.3s ease-in-out;
    font-weight: 200;
    justify-content: center;
    background-color: $gray;
    &.accent {
      background-color: $accent;
      color: $white;
    }
    &.gray {
      background-color: $dark;
    }
    &.action {
    }
    &:active {
      background-color: $darker;
    }
  }
}
</style>
