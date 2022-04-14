CREATE TABLE tx_sfseolighthouse_domain_model_lighthousestatistics (

	target int(11) DEFAULT '0' NOT NULL,
	acs double(11,2) DEFAULT '0.00' NOT NULL,
	bps double(11,2) DEFAULT '0.00' NOT NULL,
	pes double(11,2) DEFAULT '0.00' NOT NULL,
	pwas double(11,2) DEFAULT '0.00' NOT NULL,
	seos double(11,2) DEFAULT '0.00' NOT NULL, 
	fcp double(11,2) DEFAULT '0.00' NOT NULL,
	si double(11,2) DEFAULT '0.00' NOT NULL,
	lcp double(11,2) DEFAULT '0.00' NOT NULL,
	tti double(11,2) DEFAULT '0.00' NOT NULL,
	tbt double(11,2) DEFAULT '0.00' NOT NULL,
	cls double(11,2) DEFAULT '0.00' NOT NULL,
	fcps double(11,2) DEFAULT '0.00' NOT NULL,
	sis double(11,2) DEFAULT '0.00' NOT NULL,
	lcps double(11,2) DEFAULT '0.00' NOT NULL,
	ttis double(11,2) DEFAULT '0.00' NOT NULL,
	tbts double(11,2) DEFAULT '0.00' NOT NULL,
	clss double(11,2) DEFAULT '0.00' NOT NULL,
	device varchar(255) NOT NULL DEFAULT '',
	audit JSON NOT NULL DEFAULT ''
);
