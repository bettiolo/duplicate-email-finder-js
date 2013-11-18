var duplicateEmails = (function() {
	'use strict';

	return {
		find: function(inputText) {
			var entries = this.parseInputText(inputText),
				duplicates = { },
				i;

			for (i = 0; i < entries.length; i++) {
				var entry = entries[i],
					address = entry.address.filtered;
				if (!duplicates[address]) {
					duplicates[address] = [];
				}
				duplicates[address].push(entry);
			}
			return duplicates;
		},
		_getSortable: function (duplicates, sort) {
			var	sortable = [],
				duplicateAddresses = Object.keys(duplicates),
				address,
				i;
			for (i = 0; i < duplicateAddresses.length; i++) {
				address = duplicateAddresses[i];
				sortable.push([address, duplicates[address].length]);
			}
			sortable.sort(sort);
			return sortable;
		},
		getIndexByCountDesc: function (duplicates) {
			var index = [],
				sortable = this._getSortable(duplicates, function (a, b) { return b[1] - a[1]}),
				i;
			for (i = 0; i < sortable.length; i++) {
				index.push(sortable[i][0]);
			}
			return index;
		},
		getIndexByName: function (duplicates) {
			var addressIndex = Object.keys(duplicates);
			addressIndex.sort();
			return addressIndex;
		},
		parseInputText: function (inputText) {
			var inputTextLines = this.splitInputText(inputText),
				entries = [],
				i;
			for (i = 0; i < inputTextLines.length; i++) {
				entries.push(this.parseInputLine(inputTextLines[i]));
			}
			return entries;
		},
		splitInputText: function (inputText) {
			var splitInputText = inputText.split('\n'),
				filteredInputText = [],
				i;
			for (i = 0; i < splitInputText.length; i++) {
				if (splitInputText[i].trim()) {
					filteredInputText.push(splitInputText[i]);
				}
			}
			return filteredInputText;
		},
		parseInputLine: function (inputLine) {
			var fields = this.splitInputLine(inputLine),
				address = this.parseAddress(fields.shift());
			return {
				address: address,
				fields: fields
			};
		},
		splitInputLine: function (inputLine) {
			var trimmedInputLine = inputLine.trim();
			if (!trimmedInputLine) {
				return [];
			}
			var normalizedInputLine = trimmedInputLine.replace(/\s+/g, '\t');
			return normalizedInputLine.split('\t');
		},
		parseAddress: function (address) {
			var trimmedAddress = (address || '').trim(),
				localPart = this.getLocalPart(trimmedAddress),
				domainPart = this.getDomainPart(trimmedAddress);

			var valid = (localPart ? true : false) && (domainPart ? true : false);
			var filteredAddress = valid ? (localPart + '@' + domainPart) : trimmedAddress;
			return {
				valid: valid,
				filtered: filteredAddress,
				original: trimmedAddress
			};
		},
		getLocalPart: function (address) {
			var localPart = address.split('@')[0];
			return this.filterLocalPart(localPart);
		},
		filterLocalPart: function (localPart) {
			var i,
				filteredAddress = '',
				character;
			for (i = 0; i < localPart.length; i++) {
				character = localPart[i];
				if (character == '+') {
					break;
				}
				if (character != '.') {
					filteredAddress += character;
				}
			}
			return filteredAddress;
		},
		getDomainPart: function (address) {
			return address.split('@')[1];
		}
	};

})();