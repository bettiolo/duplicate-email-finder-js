$(function () {
	'use strict';

	$('#parse-data').click(function () {
		var inputText = $('#source-data').val(),
			duplicateCount = 0,
			uniqueCount = 0;
		renderDuplicates(inputText, $('#duplicate-output'), function matchDuplicateOnly(duplicate) {
			if (duplicate.length > 1) {
				duplicateCount++;
				return true;
			}
			return false;
		});
		renderDuplicates(inputText, $('#unique-output'), function matchUniqueOnly(duplicate) {
			if (duplicate.length == 1) {
				uniqueCount++;
				return true;
			}
			return false;
		});
		$('#duplicate-count').text(duplicateCount);
		$('#unique-count').text(uniqueCount);
	});

	function renderDuplicates(inputText, $output, matcher) {
		$output.empty();
		var duplicates = duplicateEmails.find(inputText),
			duplicateAddresses = Object.keys(duplicates),
			$duplicatesList = $('<ul></ul>'),
			address,
			i;

		for (i = 0; i < duplicateAddresses.length; i++) {
			address = duplicateAddresses[i];
			if (matcher(duplicates[address])) {
				$duplicatesList.append(renderDuplicate(address, duplicates[address]));
			}
		}
		$output.append($duplicatesList);
	}

	function renderDuplicate(address, duplicate) {
		var $duplicateListItem = $('<li></li>'),
			$duplicateEntries = $('<table></table>'),
			i;

		$duplicateListItem.text(address + ' (' + duplicate.length + ')');
		for (i = 0; i < duplicate.length; i++) {
			$duplicateEntries.append(renderDuplicateEntries(duplicate[i]));
		}
		$duplicateListItem.append($duplicateEntries);
		return $duplicateListItem;
	}

	function renderDuplicateEntries(duplicateEntries) {
		var $duplicateEntry = $('<tr></tr>'),
			$addressCell = $('<td></td>'),
			$fieldCell,
			field,
			i;

		$addressCell.text(duplicateEntries.address.original);
		$duplicateEntry.append($addressCell);
		for (i = 0; i < duplicateEntries.fields.length; i++) {
			field = duplicateEntries.fields[i];
			$fieldCell = $('<td></td>');
			$fieldCell.text(field);
			$duplicateEntry.append($fieldCell);
		}
		return $duplicateEntry;
	}

});