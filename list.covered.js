
(function iffe() { return function append(item){var current=this.head;this.emit('NODE_STEP',{ast:'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"current","range":[49,56],"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":17}}},"init":{"type":"MemberExpression","computed":false,"object":{"type":"ThisExpression","range":[59,63],"loc":{"start":{"line":2,"column":20},"end":{"line":2,"column":24}}},"property":{"type":"Identifier","name":"head","range":[64,68],"loc":{"start":{"line":2,"column":25},"end":{"line":2,"column":29}}},"range":[59,68],"loc":{"start":{"line":2,"column":20},"end":{"line":2,"column":29}}},"range":[49,68],"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":29}}}],"kind":"var","range":[45,69],"loc":{"start":{"line":2,"column":6},"end":{"line":2,"column":30}},"walking":true}',code:'var current = this.head;',variables:{current:current}});var newNode=new Node(item);this.emit('NODE_STEP',{ast:'{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"newNode","range":[80,87],"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":17}}},"init":{"type":"NewExpression","callee":{"type":"Identifier","name":"Node","range":[94,98],"loc":{"start":{"line":3,"column":24},"end":{"line":3,"column":28}}},"arguments":[{"type":"Identifier","name":"item","range":[99,103],"loc":{"start":{"line":3,"column":29},"end":{"line":3,"column":33}}}],"range":[90,104],"loc":{"start":{"line":3,"column":20},"end":{"line":3,"column":34}}},"range":[80,104],"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":34}}}],"kind":"var","range":[76,105],"loc":{"start":{"line":3,"column":6},"end":{"line":3,"column":35}},"walking":true}',code:'var newNode = new Node(item);',variables:{newNode:newNode}});while(current.next!==null){current=current.next;this.emit('NODE_STEP',{ast:'{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"current","range":[152,159],"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":15}}},"right":{"type":"MemberExpression","computed":false,"object":{"type":"Identifier","name":"current","range":[162,169],"loc":{"start":{"line":5,"column":18},"end":{"line":5,"column":25}}},"property":{"type":"Identifier","name":"next","range":[170,174],"loc":{"start":{"line":5,"column":26},"end":{"line":5,"column":30}}},"range":[162,174],"loc":{"start":{"line":5,"column":18},"end":{"line":5,"column":30}}},"range":[152,174],"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":30}}},"range":[152,175],"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":31}},"walking":true}',code:'current = current.next;',variables:{current:current}});}this.emit('NODE_STEP',{ast:'{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"!==","left":{"type":"MemberExpression","computed":false,"object":{"type":"Identifier","name":"current","range":[119,126],"loc":{"start":{"line":4,"column":13},"end":{"line":4,"column":20}}},"property":{"type":"Identifier","name":"next","range":[127,131],"loc":{"start":{"line":4,"column":21},"end":{"line":4,"column":25}}},"range":[119,131],"loc":{"start":{"line":4,"column":13},"end":{"line":4,"column":25}}},"right":{"type":"Literal","value":null,"raw":"null","range":[136,140],"loc":{"start":{"line":4,"column":30},"end":{"line":4,"column":34}}},"range":[119,140],"loc":{"start":{"line":4,"column":13},"end":{"line":4,"column":34}}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"current","range":[152,159],"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":15}}},"right":{"type":"MemberExpression","computed":false,"object":{"type":"Identifier","name":"current","range":[162,169],"loc":{"start":{"line":5,"column":18},"end":{"line":5,"column":25}}},"property":{"type":"Identifier","name":"next","range":[170,174],"loc":{"start":{"line":5,"column":26},"end":{"line":5,"column":30}}},"range":[162,174],"loc":{"start":{"line":5,"column":18},"end":{"line":5,"column":30}}},"range":[152,174],"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":30}}},"range":[152,175],"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":31}}}],"range":[142,183],"loc":{"start":{"line":4,"column":36},"end":{"line":6,"column":7}}},"range":[112,183],"loc":{"start":{"line":4,"column":6},"end":{"line":6,"column":7}},"walking":true}',code:'while (current.next !== null) {\n    current = current.next;\n}',variables:{}});current.next=newNode;this.emit('NODE_STEP',{ast:'{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"MemberExpression","computed":false,"object":{"type":"Identifier","name":"current","range":[190,197],"loc":{"start":{"line":7,"column":6},"end":{"line":7,"column":13}}},"property":{"type":"Identifier","name":"next","range":[198,202],"loc":{"start":{"line":7,"column":14},"end":{"line":7,"column":18}}},"range":[190,202],"loc":{"start":{"line":7,"column":6},"end":{"line":7,"column":18}}},"right":{"type":"Identifier","name":"newNode","range":[205,212],"loc":{"start":{"line":7,"column":21},"end":{"line":7,"column":28}}},"range":[190,212],"loc":{"start":{"line":7,"column":6},"end":{"line":7,"column":28}}},"range":[190,213],"loc":{"start":{"line":7,"column":6},"end":{"line":7,"column":29}},"walking":true}',code:'current.next = newNode;',variables:{current:current}});}; })();
