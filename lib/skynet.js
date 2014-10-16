(function(module) {

	var SkynetRepo = function() {

	}

	SkynetRepo.prototype.createPin = function() {
	}

	var SkynetPipeline = function(owner) {
		this.owner = owner;
		this.steps = [];
	}

	SkynetPipeline.prototype.from = function(step) {
		this.steps.push(step);
		return this;
	}

	SkynetPipeline.prototype.spawnParallel = function(step) {
		this.steps.push(step);
		return this;
	}

	SkynetPipeline.prototype.parallel = function(parsteps) {
		this.steps.push(parsteps);
		return this;
	}

	SkynetPipeline.prototype.pipe = function(step) {
		this.steps.push(step);
		return this;
	}

	var Skynet = {}

	Skynet.pipeline = function() {
		var p = new SkynetPipeline(this);
		return p;
	}

	Skynet.run = function(pipeline, environment) {
		var repo = new SkynetRepo();



		console.log('in run', pipeline, environment);
		console.log(JSON.stringify(pipeline.steps, null, 2));
	}

	module.Skynet = Skynet;

})(exports || this);