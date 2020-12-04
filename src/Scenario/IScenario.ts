export default interface IScenario {

   /**
    * This represents the compiled DOM Element for the component. This should be reactive to state changes on
    */
   element: Element

   /**
    * These represent properties that are bound to the scenario component via some form of attribute binding.
    */
   props: any

   /**
    * an object with methods that are bound to the context and allow for easy DOM traversal / scope manipulation.
    * When these are activated, they should trigger a rerender of the element. This will be useful for things like
    * input / element interaction / event reactivity.
    * @param methods
    */
   helpers(methods: Object)

   /**
    * performs a querySelector on the scenario element, syntax borrowed from chrome devtools.
    * @param query
    */
   $(query: String): Element

   /**
    * Performs a querySelectorAll on the scenario element, syntax borrowed from chrome devtools.
    */
   $$(query: String): Array<Element>

   /**
    * This will cause the component template to rerender based on the current state of the props.
    * We might be able to make this private and use proxies to trigger this based on state manipulation?
    */
   render(): void

}
