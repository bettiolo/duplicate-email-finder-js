$(function () {
	'use strict';

	$('#parse-data').click(function () {
		var inputText = $('#source-data').val(),
			duplicateCount = 0,
			uniqueCount = 0;
		findDuplicates(inputText, $('#duplicate-output'), function matchDuplicateOnly(duplicate) {
			if (duplicate.length > 1) {
				duplicateCount++;
				return true;
			}
			return false;
		});
		findDuplicates(inputText, $('#unique-output'), function matchUniqueOnly(duplicate) {
			if (duplicate.length == 1) {
				uniqueCount++;
				return true;
			}
			return false;
		});
		$('#duplicate-count').text(duplicateCount);
		$('#unique-count').text(uniqueCount);
	});

	function findDuplicates(inputText, $output, matcher) {
		$output.empty();
		var duplicates = duplicateEmails.find(inputText),
			duplicateAddresses = Object.keys(duplicates),
			$duplicatesList = $('<ul></ul>'),
			address,
			i;

		for (i = 0; i < duplicateAddresses.length; i++) {
			address = duplicateAddresses[i];
			if (matcher(duplicates[address])) {
				$duplicatesList.append(getDuplicateOutputElement(address, duplicates[address]));
			}
		}

		$output.append($duplicatesList);
	}

	function getDuplicateOutputElement(address, duplicate) {
		var $duplicateListItem = $('<li></li>'),
			$duplicateEntries = $('<table></table>'),
			$duplicateEntry,
			$addressCell,
			i;
		$duplicateListItem.text(address + ' (' + duplicate.length + ')');
		if (duplicate) {
			for (i = 0; i < duplicate.length; i++) {
				$duplicateEntry = $('<tr></tr>');
				$addressCell = $('<td></td>');
				$addressCell.text(duplicate[i].address.original);
				$duplicateEntry.append($addressCell);
				renderDuplicateEntries($duplicateEntry, duplicate[i]);
				$duplicateEntries.append($duplicateEntry);
			}
		}
		$duplicateListItem.append($duplicateEntries);
		return $duplicateListItem;
	}

	function renderDuplicateEntries($duplicateEntry, duplicateEntries) {
		var $fieldCell,
			field,
			i;
		for (i = 0; i < duplicateEntries.fields.length; i++) {
			field = duplicateEntries.fields[i];
			$fieldCell = $('<td></td>');
			$fieldCell.text(field);
			$duplicateEntry.append($fieldCell);
		}
	}

});