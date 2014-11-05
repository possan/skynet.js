Streamjobs.js
====

### Background

Hadoopish workers in Javascript based on http streams and local event streams instead of intermediate filesystem storage.

## Roles:

### Controllers
Responsible for creating new workers and piping urls with datapipes to workers

```
{
	nodes: {
		{
			"id": "a",
			"source": "githubusername/someworker",
			"parameters:" {
			}
		},
		{
			"id": "b",
			"source": ....
			"parameters": {
			},
			"inputs": {
				"main": "http://kjhrjqkwhrkjew",
				"secondary": "@a.output"
			}
		}
	}
}
```



```
var S = require('streamjobs').Runner;
var a = require('possan/twitterFeed');
var b = require('username/keywordExtractor');
var c = require('username/printer');
var request = require('request');

var t = request.get("http://twitter/json");

S.start(a, {
	input: t
});

S.start(b, {
	input: a.output
});

S.start(c);

S.connect(b.output, c.input);

t.pipe(a.object);

a.output.pipe(b, { ratelimit: 1000, spawnLimit: 3, buffer: false });

a.output.pipe(b, { ratelimit: 1000, spawnLimit: 3, buffer: false });

var t = request.get(a.output.getURL());
S.start(b);
b.connect…..

S.onStart = function() {
}

S.onExit = function() {
}

S.run();
```



```
var S = require('streamjobs').Runner;
var aws = require('aws');
var a = require('myjob');
var request = require('request');

var t = request.get("http://twitter/json");

S.initialize(a, {
	inputs: { feed: t }
outputs: { } 
});

S.on('saturated', function(err, worker){
S.spawn(worker, 1);
})

S.on('saturated', new CompanySpawnPolicy());

S.run(new CompanyDatawarehouseThingy())
```


### Test

`````
var runner = require('streamjobs').Runner;
var b = require('username/keywordExtractor')

it('runner start workers with key shard strategy, function(done) {
	
var output = new Stream();
var output2 = new Stream();

runner.use(b, {
inputs: { source:new RoundRobinStrategy([key:'a', key:'b']) },
outputs: { destinations: new KeyShardStrategy([output, output2], key:'key') }
});

runner.start()

	var  keyA = output.pop();
	assertEquals(keyA.key, "a");

	var  keyB = output2.pop();
	assertEquals(keyB.key, "b");

assertTrue(output.isEmpty());
assertTrue(output2.isEmpty());
done();
});

it('should extract keywords from a stream, function(done) {
	var sample = [
		{username: 'user', tweet: 'hello world'},
		{username: 'user', tweet: 'hello foo'},
		{username: 'user', tweet: 'hello var'},
		{username: 'user', tweet: 'hi world'},
	];

var output = new Stream();
var feed = new Stream(sample);

	var worker = b.listen(); 
	assertEquals(worker.input.port, 1337);
	assertEquals(worker.output.port, 1338);
	assertEquals(worker.controller.port, 1339);

	request.get(worker.output.url).pipe(output);
feed.pipe(worker.input);
feed.pipe(worker.input.url);
assertEqual(output.pop(), {keyword: 'hello'});


.: { source:new RoundRobinStrategy(feed) },
outputs: { destinations: new KeyShardStrategy([output, output2], key:'key') },
retryCount: 0 // forever (-1) is default
});

runner.run()

	var  e = output.pop();
	assertEquals(e.keyword, "hello");
...

assertTrue(output.isEmpty());
done();
});





### Workers
Takes a set of urls containing pipes of JSON data and processes the information and emits data to the urls assigned by the controller.

### Worker definition

{
	startCommand: "npm start",  // default 
	dockerRequirements: ["dockerfile/nodejs"] // default
}

### Worker instance definition

{
	inputs: {
		main: "redis://server/channel"
	},
	outputs: {
		main: "hdfs://somewhere"
	},
	parameters: {
		username: "someone"
	}
}
```

























































