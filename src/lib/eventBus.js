/*
    Event Bus for global events.

    Ref: https://v3-migration.vuejs.org/breaking-changes/events-api.html#root-component-events
*/
import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args)
}