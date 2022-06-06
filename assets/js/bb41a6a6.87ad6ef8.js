"use strict";(self.webpackChunkwondsn=self.webpackChunkwondsn||[]).push([[634],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),u=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),s=u(n),f=a,k=s["".concat(p,".").concat(f)]||s[f]||m[f]||o;return n?r.createElement(k,i(i({ref:t},c),{},{components:n})):r.createElement(k,i({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=s;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},7367:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],l={},p=void 0,u={unversionedId:"development/refactoring/ch3",id:"development/refactoring/ch3",title:"ch3",description:"--",source:"@site/docs/development/refactoring/ch3.md",sourceDirName:"development/refactoring",slug:"/development/refactoring/ch3",permalink:"/til/docs/development/refactoring/ch3",editUrl:"https://github.com/wondsn/til/edit/main/docs/development/refactoring/ch3.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\ub0c4\uc0c8 4. \uae34 \ub9e4\uac1c\ubcc0\uc218 \ubaa9\ub85d",permalink:"/til/docs/development/refactoring/ch4"},next:{title:"1. \ub2e8\uc704 \ud14c\uc2a4\ud2b8\uc758 \ubaa9\ud45c",permalink:"/til/docs/development/unit-testing/ch1"}},c={},m=[{value:"title: \ub0c4\uc0c8 3. \uae34 \ud568\uc218",id:"title-\ub0c4\uc0c8-3-\uae34-\ud568\uc218",level:2},{value:"\uac1c\uc694",id:"\uac1c\uc694",level:2},{value:"\uc784\uc2dc \ubcc0\uc218\ub97c \uc9c8\uc758 \ud568\uc218\ub85c \ubc14\uafb8\uae30",id:"\uc784\uc2dc-\ubcc0\uc218\ub97c-\uc9c8\uc758-\ud568\uc218\ub85c-\ubc14\uafb8\uae30",level:2},{value:"before",id:"before",level:3},{value:"after",id:"after",level:3}],s={toc:m};function f(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"--\nsidebar_position: 3"),(0,o.kt)("h2",{id:"title-\ub0c4\uc0c8-3-\uae34-\ud568\uc218"},"title: \ub0c4\uc0c8 3. \uae34 \ud568\uc218"),(0,o.kt)("h2",{id:"\uac1c\uc694"},"\uac1c\uc694"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\uc9e7\uc740 \ud568\uc218 vs \uae34 \ud568\uc218",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\ud568\uc218\uac00 \uae38\uc218\ub85d \uc774\ud574\ud558\uae30 \uc5b4\ub824\uc6c0 vs \ud568\uc218\uac00 \uc9e7\uc744\uc218\ub85d \ub9ce\uc740 \ubb38\ub9e5 \uc804\ud658\uc774 \ud544\uc694"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"\uacfc\uac70\uc5d0\ub294")," \uc791\uc740 \ud568\uc218\ub97c \uc0ac\uc6a9\ud558\ub294 \uacbd\uc6b0 \ub354 \ub9ce\uc740 \uc11c\ube0c\ub8e8\ud2f4(\ud568\uc218) \ud638\ucd9c\ub85c \uc778\ud55c \uc624\ubc84\ud5e4\ub4dc \uc788\uc5c8\uc74c"),(0,o.kt)("li",{parentName:"ul"},"\uc9c0\uae08\uc740 \ucef4\ud30c\uc77c\ub7ec\ub2e8\uc5d0\uc11c \ucd5c\uc801\ud654\ub97c \ud1b5\ud574 \ub9ce\uc740 \uc11c\ube0c\ub8e8\ud2f4 \ud638\ucd9c\uc744 \uc904\uc77c \uc218 \uc788\uc74c"),(0,o.kt)("li",{parentName:"ul"},"\uc791\uc740 \ud568\uc218\uc5d0 ",(0,o.kt)("strong",{parentName:"li"},"\uc88b\uc740 \uc774\ub984"),"\ub97c \uc0ac\uc6a9\ud588\ub2e4\uba74 \ud574\ub2f9 \ud568\uc218\uc758 \ucf54\ub4dc\ub97c \ubcf4\uc9c0 \uc54a\uace0\ub3c4 \uc774\ud574\ud560 \uc218 \uc788\uc5b4\uc57c \ud568"),(0,o.kt)("li",{parentName:"ul"},"\uc5b4\ub5a4 \ucf54\ub4dc\uc5d0 ",(0,o.kt)("strong",{parentName:"li"},"\uc8fc\uc11d"),"\uc744 \ub0a8\uae30\uace0 \uc2f6\ub2e4\uba74, \uc8fc\uc11d \ub300\uc2e0 \ud568\uc218\ub97c \ub9cc\ub4e4\uace0 \ud568\uc218\uc758 \uc774\ub984\uc73c\ub85c ",(0,o.kt)("strong",{parentName:"li"},"\uc758\ub3c4"),"\ub97c \ud45c\ud604"))),(0,o.kt)("li",{parentName:"ul"},"99%\ub294 ",(0,o.kt)("strong",{parentName:"li"},"\ud568\uc218 \ucd94\ucd9c\ud558\uae30"),"\ub85c \ud574\uacb0\ud560 \uc218 \uc788\uc74c"),(0,o.kt)("li",{parentName:"ul"},"\ud568\uc218\ub97c \ubd84\ub9ac\ud558\uba74\uc11c ",(0,o.kt)("strong",{parentName:"li"},"\uc804\ub2ec\ud574\uc57c\ud560 \ub9e4\uac1c\ubcc0\uc218\uac00 \ub9ce\uc544\uc9c4\ub2e4\uba74")," \ub2e4\uc74c \ub9ac\ud329\ud1a0\ub9c1\uc744 \uace0\ub824",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"\uc784\uc2dc \ubcc0\uc218\ub97c \uc9c8\uc758 \ud568\uc218\ub85c \ubc14\uafb8\uae30"),(0,o.kt)("li",{parentName:"ul"},"\ub9e4\uac1c\ubcc0\uc218 \uac1d\uccb4 \ub9cc\ub4e4\uae30"),(0,o.kt)("li",{parentName:"ul"},"\uac1d\uccb4 \ud1b5\uc9f8\ub85c \ub118\uae30\uae30"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"\uc870\uac74\ubb38 \ubd84\ud574\ud558\uae30"),"\ub97c \uc0ac\uc6a9\ud574 \uc870\uac74\ubb38\uc744 \ubd84\ub9ac\ud560 \uc218 \uc788\uc74c"),(0,o.kt)("li",{parentName:"ul"},"\uac19\uc740 \uc870\uac74\uc73c\ub85c \uc5ec\ub7ec\uac1c switch \ubb38\uc774 \uc788\ub2e4\uba74, ",(0,o.kt)("strong",{parentName:"li"},"\uc870\uac74\ubb38\uc744 \ub2e4\ud615\uc131\uc73c\ub85c \ubc14\uafb8\uae30"),"\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc74c"),(0,o.kt)("li",{parentName:"ul"},"\ubc18\ubcf5\ubb38 \uc548\uc5d0 \uc5ec\ub7ec \uc791\uc5c5\uc744 \ud558\uace0 \uc788\uc5b4\uc11c \ud558\ub098\uc758 \uba54\uc18c\ub4dc\ub85c \ucd94\ucd9c\ud558\uae30 \uc5b4\ub835\ub2e4\uba74, ",(0,o.kt)("strong",{parentName:"li"},"\ubc18\ubcf5\ubb38 \ucabc\uac1c\uae30"),"\ub97c \uc801\uc6a9\ud560 \uc218 \uc788\uc74c")),(0,o.kt)("h2",{id:"\uc784\uc2dc-\ubcc0\uc218\ub97c-\uc9c8\uc758-\ud568\uc218\ub85c-\ubc14\uafb8\uae30"},"\uc784\uc2dc \ubcc0\uc218\ub97c \uc9c8\uc758 \ud568\uc218\ub85c \ubc14\uafb8\uae30"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\ubcc0\uc218\ub97c \uc0ac\uc6a9\ud558\uba74 \ubc18\ubcf5\ud574\uc11c \ub3d9\uc77c\ud55c \uc2dd\uc744 \uacc4\uc0b0\ud558\ub294 \uac83\uc744 \ud53c\ud560 \uc218 \uc788\uc74c. \ub610 \uc774\ub984\uc744 \uc0ac\uc6a9\ud574 \uc758\ubbf8\ub97c \ud45c\ud604\ud560 \uc218 \uc788\uc74c"),(0,o.kt)("li",{parentName:"ul"},"\uae34 \ud568\uc218\ub97c \ub9ac\ud329\ud1a0\ub9c1\ud560 \ub54c, \uadf8\ub7ec\ud55c \uc784\uc2dc \ubcc0\uc218\ub97c \ud568\uc218\ub85c \ucd94\ucd9c\ud558\uc5ec \ubd84\ub9ac -> \ubeb4\ub0b8 \ud568\uc218\ub85c \uc804\ub2ec\ud574\uc57c\ud560 \ub9e4\uac1c\ubcc0\uc218\ub97c \uc904\uc77c \uc218 \uc788\uc74c")),(0,o.kt)("h3",{id:"before"},"before"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'private void print() {\n\n    ...\n\n    participants.forEach(p -> {\n        long count = p.homework().values().stream()\n                .filter(v -> v == true)\n                .count();\n        double rate = count * 100 / totalNumberOfEvents;\n\n        String markdownForHomework = String.format("| %s %s | %.2f%% |\\n", p.username(), checkMark(p, totalNumberOfEvents), rate);\n        writer.print(markdownForHomework);\n    });\n\n}\n')),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"\ud568\uc218 \ucd94\ucd9c\ud558\uae30"),"\ub97c \ud1b5\ud574 markdown\uc744 \ud504\ub9b0\ud2b8\ud558\ub294 \ubd80\ubd84\uc744 \ucd94\uce28")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'private void print() {\n\n    ...\n\n    participants.forEach(p -> {\n        long count = p.homework().values().stream()\n                .filter(v -> v == true)\n                .count();\n        double rate = count * 100 / totalNumberOfEvents;\n\n        String markdownForHomework = getMarkdownForParticipant(totalNumberOfEvents, p, rate);\n        writer.print(markdownForHomework);\n    });\n}\n\nprivate String getMarkdownForParticipant(int totalNumberOfEvents, Participant p, double rate) {\n    String markdownForHomework = String.format("| %s %s | %.2f%% |\\n", p.username(), checkMark(p, totalNumberOfEvents), rate);\n    return markdownForHomework;\n}\n\n')),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\uc5ec\uae30\uc11c ",(0,o.kt)("inlineCode",{parentName:"li"},"getMarkdownForParticipant")," \ud568\uc218\uc758 \ub9e4\uac1c\ubcc0\uc218\uc778 ",(0,o.kt)("inlineCode",{parentName:"li"},"rate"),"\ub294 \uc9c8\uc758 \ud568\uc218\ub85c \ubc14\uafc0 \uc218 \uc788\uc74c"),(0,o.kt)("li",{parentName:"ul"},"\uadf8\ub7ec\uba74 ",(0,o.kt)("inlineCode",{parentName:"li"},"getMarkdownForParticipant")," \ud568\uc218 \ub9e4\uac1c\ubcc0\uc218\ub97c 3 -> 2\uac1c\ub85c \uc904\uc77c \uc218 \uc788\uc74c")),(0,o.kt)("h3",{id:"after"},"after"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'private void print() {\n\n    ...\n\n    participants.forEach(p -> {\n        String markdownForHomework = getMarkdownForParticipant(totalNumberOfEvents, p);\n        writer.print(markdownForHomework);\n    });\n}\n\nprivate String getMarkdownForParticipant(int totalNumberOfEvents, Participant p) {\n    return String.format("| %s %s | %.2f%% |\\n", p.username(), checkMark(p, totalNumberOfEvents), getRate(totalNumberOfEvents, p));\n}\n\nprivate double getRate(int totalNumberOfEvents, Participant p) {\n    long count = p.homework().values().stream()\n            .filter(v -> v == true)\n            .count();\n    return (double) (count * 100 / totalNumberOfEvents);\n}\n')))}f.isMDXComponent=!0}}]);