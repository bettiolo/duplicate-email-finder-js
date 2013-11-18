describe('Address parser', function (){
	'use strict';
	var testAddress = 'test@example.com';

	it('Returns the same address', function () {
		var address = duplicateEmails.parseAddress(testAddress);
		expect(address.value).toBe(testAddress);
		expect(address.valid).toBeTruthy();
	});

	it('Trims the address', function () {
		var nonTrimmedAddress = ' 	  test@example.com	    	',
			address = duplicateEmails.parseAddress(nonTrimmedAddress);
		expect(address.value).toBe(testAddress);
		expect(address.valid).toBeTruthy();
	});

	it('Ignores dots, spaces and everything after plus', function () {
		var nonFilteredAddress = ' 	  t...e.s.t+oth.er@example.com	    	',
			address = duplicateEmails.parseAddress(nonFilteredAddress);
		expect(address.value).toBe(testAddress);
		expect(address.valid).toBeTruthy();
	});

	it('Returns address invalid', function () {
		var invalidAddress = 'BROKEN',
			address = duplicateEmails.parseAddress(invalidAddress);
		expect(address.value).toBe(invalidAddress);
		expect(address.valid).toBeFalsy();
	});
});

describe('Local Part parser', function () {
	'use strict';
	var testAddress = 'test@example.com',
		testLocalPart = 'test';

	it('Returns the local part', function () {
		var localPart = duplicateEmails.getLocalPart(testAddress);
		expect(localPart).toBe(testLocalPart);
	});

	it('Ignores dot', function () {
		var inputWithDot = 't.est@example.com',
			localPart = duplicateEmails.getLocalPart(inputWithDot);
		expect(localPart).toBe(testLocalPart);
	});

	it('Ignores everything after PLUS character', function () {
		var inputWithPlus = 'test+other@example.com',
			localPart = duplicateEmails.getLocalPart(inputWithPlus);
		expect(localPart).toBe(testLocalPart);
	});
});

describe('Domain Part parser', function () {
	'use strict';
	var testAddress = 'test@example.com',
		testDomainPart = 'example.com';

	it('Returns the domain part', function () {
		var domainPart = duplicateEmails.getDomainPart(testAddress);
		expect(domainPart).toBe(testDomainPart);
	});
});

describe('Input Line parser', function () {
	'use strict';
	var testAddress = 'test@example.com',
		testField1 = 'field-c1',
		testField2 = 'field-c2';

	it('Returns the split address and fields', function () {
		var testInputLine = 'te.s.t.+test@example.com	field-c1	field-c2';
		var inputs = duplicateEmails.parseInputLine(testInputLine);
		expect(inputs.address.value).toBe(testAddress);
		expect(inputs.fields[0]).toBe(testField1);
		expect(inputs.fields[1]).toBe(testField2);
	});

	it('Parses data with may spaces and tabs', function () {
		var testInputLine = '   	 te.s.t.+test@example.com		   	field-c1  	   field-c2  ';
		var inputs = duplicateEmails.parseInputLine(testInputLine);
		expect(inputs.address.value).toBe(testAddress);
		expect(inputs.fields[0]).toBe(testField1);
		expect(inputs.fields[1]).toBe(testField2);
	});

	it('Parses data with single field', function () {
		var testInputLine = 'te.s.t.+test@example.com field-c1';
		var inputs = duplicateEmails.parseInputLine(testInputLine);
		expect(inputs.address.value).toBe(testAddress);
		expect(inputs.fields[0]).toBe(testField1);
		expect(inputs.fields.length).toBe(1);
	});

	it('Parses data without field', function () {
		var testInputLine = 'te.s.t.+test@example.com';
		var inputs = duplicateEmails.parseInputLine(testInputLine);
		expect(inputs.address.value).toBe(testAddress);
		expect(inputs.fields.length).toBe(0);
	});

	it('Parses empty data', function () {
		var testInputLine = '    ';
		var inputs = duplicateEmails.parseInputLine(testInputLine);
		expect(inputs.address.value).toBe('');
		expect(inputs.address.valid).toBeFalsy();
		expect(inputs.fields.length).toBe(0);
	});
});

describe('Input Line splitter', function () {
	'use strict';

	it('Returns the split input line', function () {
		var inputs = duplicateEmails.splitInputLine('a b c');
		expect(inputs[0]).toBe('a');
		expect(inputs[1]).toBe('b');
		expect(inputs[2]).toBe('c');
	});

	it('Handles multiple spaces', function () {
		var inputs = duplicateEmails.splitInputLine('a  b  c');
		expect(inputs[0]).toBe('a');
		expect(inputs[1]).toBe('b');
		expect(inputs[2]).toBe('c');
	});

	it('Handles tab', function () {
		var inputs = duplicateEmails.splitInputLine('a\tb\tc');
		expect(inputs[0]).toBe('a');
		expect(inputs[1]).toBe('b');
		expect(inputs[2]).toBe('c');
	});

	it('Handles multiple tabs', function () {
		var inputs = duplicateEmails.splitInputLine('a\t\tb\t\tc');
		expect(inputs[0]).toBe('a');
		expect(inputs[1]).toBe('b');
		expect(inputs[2]).toBe('c');
	});

	it('Handles multiple tabs and spaces mixed', function () {
		var inputs = duplicateEmails.splitInputLine('a\t  \tb \t	  \t c');
		expect(inputs[0]).toBe('a');
		expect(inputs[1]).toBe('b');
		expect(inputs[2]).toBe('c');
	});

	it('Handles multiple tabs and spaces mixed with whitespace prefix and suffix', function () {
		var inputs = duplicateEmails.splitInputLine(' \t	  \t a\t  \tb \t	  \t c\t  \t');
		expect(inputs[0]).toBe('a');
		expect(inputs[1]).toBe('b');
		expect(inputs[2]).toBe('c');
	});

	it('Handles bad input', function () {
		var inputs = duplicateEmails.splitInputLine('   ');
		expect(inputs.length).toBe(0);
	});
});

describe('Input splitter', function () {
	'use strict';
	var inputText =
			'        test@example.com	field-a1	field-a2 \n' +
			't.est@example.com	field-b1	field-b2 \n' +
			' tes.t+other@example.com	field-c1	field-c2  \n' +
			' different+test@example.com	field-d1	field-d2';

	it('Parses input lines', function () {
		var inputLines = duplicateEmails.splitInputText(inputText);
		expect(inputLines.length).toBe(4);
	});

	it('Ignores empty input lines', function () {
		var inputLines = duplicateEmails.splitInputText(inputText + '\n\n   \n');
		expect(inputLines.length).toBe(4);
	});

	it('Handles empty input', function () {
		var inputLines = duplicateEmails.splitInputText('');
		expect(inputLines.length).toBe(0);
	});
});

describe('Input parser', function () {
	'use strict';
	var testAddress = 'test@example.com',
		inputText =
			'        test@example.com	field-a1	field-a2 \n' +
			't.est@example.com	field-b1	field-b2 \n' +
			' tes.t+other@example.com	field-c1	field-c2  \n' +
			' different+test@example.com	field-d1	field-d2';

	it('Parses input lines', function () {
		var inputLines = duplicateEmails.parseInputText(inputText);
		expect(inputLines[0].address.value).toBe(testAddress);
		expect(inputLines[0].address.valid).toBe(true);
	});
});

describe('Duplicate email finder', function () {
	'use strict';
	var testAddress = 'test@example.com',
		inputText =
			'        test@example.com	field-a1	field-a2 \n' +
			't.est@example.com	field-b1	field-b2 \n' +
			' tes.t+other@example.com	field-c1	field-c2  \n' +
			' different+test@example.com	field-d1	field-d2';

	it('Finds duplicates', function () {
		var duplicates = duplicateEmails.find(inputText);
		expect(Object.keys(duplicates).length).toBe(2);
		expect(duplicates[testAddress].length).toBe(3);
		expect(duplicates[testAddress][0].address.value).toBe(testAddress);
		expect(duplicates[testAddress][1].address.value).toBe(testAddress);
		expect(duplicates[testAddress][2].address.value).toBe(testAddress);
	});
});
