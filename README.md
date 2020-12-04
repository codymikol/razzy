## Razzy

This project aims to be a resilient component unit testing framework
that can be adapted to any front end web framework.

The idea is to hide all the complexities of bootstrapping a component
behind a generic interface that provides testing utilities for...

- Modification of component props
- Traversing component element nodes
- DOM level component element interaction
- Reacting to prop change / element interaction

In theory, you could write a component spec using razzy alongside something like jasmine.

Given the following angularjs component.

```javascript
    angular.module('myArbitraryModule').component('coolBanner', {
        bindings: {
            bannerText: '<',
            bannerOnClick: '<'
        },
        template: '<button id="the-button" ng-click="$ctrl.secretInternalMethod()" class="cool-class">{{$ctrl.bannerText}}</button>',
        controller() {
            let vm = this;
            
            vm.secretInternalMethod = function() {
                vm.bannerText = 'You pressed me!'
                vm.bannerOnClick();
            }

        }   
    })
```

You could write a razzy test

```javascript
describe('my banner test', () => {
    
    // This is all that is specific to angularJS
    beforeEach(() => scenarioFactory = Razzy.AngularJsScenarioFactory.create('myArbitaryModule', module, inject) )

    let buttonSpy;

    beforeEach(function() {

        buttonSpy = jasmine.createSpy('button');

        let scenario = scenarioFactory.create({
            name: 'coolBanner',
            props: {
                bannerText: 'Hello',
                bannerOnClick: buttonSpy
            },
            helpers: {
                getButton() {
                    return this.$('#the-button');
                },
                getButtonText() {
                    return this.getButton().innerText;
                },
                pressButton() {
                    return this.getButton().click();
                }   
            }   
        })
    });

    it('should have the correct initial button text passed by the bannerText prop', () => {
        expect(scenario.getButtonText()).toBe('Hello')
    })
    
    it('should change the button text upon being clicked', () => {
        scenario.pressButton();
        expect(scenario.getButtonText()).toBe('You pressed me!')
    })
    
    it('should call the passed bannerOnClick function when the button is pressed', () => {
       scenario.pressButton(); 
       expect(buttonSpy).toHaveBeenCalledOnce();
    })
 
})
```

Your beautiful test should pass! Now years will go by and one day you'll be hit with something like this
"[AngularJS End of life coming soon!](https://blog.angular.io/stable-angularjs-and-long-term-support-7e077635ee9c)".

This is where razzy can save you a lot of heartache. Because it would be a shame to have to start over writing a whole
new set of tests and then all of the functionality, razzy allows you to rewrite your component in a new format, but keep
your specs exactly as they were.

Say you decide to venture into the beautiful world of Vue development

```vue

<template>
 <button id="the-button" @click="secretInternalMethod()">{{bannerText}}</button> 
</template>

<script>
  export default {
    name: 'coolBanner',
    props: {
      bannerText: {
        type: String,
        default: '',
      },
      bannerOnClick: {
        type: Function,
        default: () => ({})
      }
    },
    methods: {
      secretInternalMethod() {
        this.bannerText = 'I pressed it!'
        this.bannerOnClick();
      }
    }
  }
</script>

```

Thats some good looking vue! Now if we just adjust

```javascript
    beforeEach(() => scenarioFactory = Razzy.AngularJsScenarioFactory.create('myArbitaryModule', module, inject) )
```

to

```javascript
    beforeEach(() => scenarioFactory = Razzy.VueScenarioFactory.create())
```

viola! All our original tests should now work... wait.

```
ERROR: 'should change the button text upon being clicked' expected 'You pressed me!' actual 'I pressed it!'
```

^^^ Bugs caught like this are the real benifit of Razzy. You can start quickly port your components into new frameworks
with the safety net of a good test bed. This should help get project migrations done quickly and with far less error.
