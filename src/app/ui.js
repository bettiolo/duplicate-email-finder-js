$(function () {
	'use strict';

	$('#parse-data').click(function () {
		var inputText = $('#source-data').val(),
			duplicates = duplicateEmails.find(inputText),
			duplicateCount = 0,
			uniqueCount = 0;
		renderDuplicates(duplicates, $('#duplicate-output'), function matchDuplicateOnly(duplicate) {
			if (duplicate.length > 1) {
				duplicateCount++;
				return true;
			}
			return false;
		});
		renderDuplicates(duplicates, $('#unique-output'), function matchUniqueOnly(duplicate) {
			if (duplicate.length == 1) {
				uniqueCount++;
				return true;
			}
			return false;
		});
		$('#duplicate-count').text(duplicateCount);
		$('#unique-count').text(uniqueCount);
	});

	function renderDuplicates(duplicates, $output, matcher) {
		$output.empty();
		var duplicateAddresses = Object.keys(duplicates),
			$duplicates = $('<table></table>'),
			address,
			i;

		for (i = 0; i < duplicateAddresses.length; i++) {
			address = duplicateAddresses[i];
			if (matcher(duplicates[address])) {
				$duplicates.append(renderDuplicate(address, duplicates[address]));
			}
		}
		$output.append($duplicates);
	}

	function renderDuplicate(address, duplicate) {
		var $duplicate = $('<tbody></tbody>'),
			$duplicateRow = $('<tr></tr>'),
			$duplicateItem = $('<th></th>'),
			i;

		$duplicateItem.text(address + ' (' + duplicate.length + ')');
		$duplicateRow.append($duplicateItem);
		$duplicate.append($duplicateRow);
		for (i = 0; i < duplicate.length; i++) {
			$duplicate.append(renderDuplicateEntries(duplicate[i]));
		}
		return $duplicate;
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