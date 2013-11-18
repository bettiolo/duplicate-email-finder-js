$(function () {
	'use strict';

	$('#parse-data').click(function () {
		var inputText = $('#source-data').val(),
			duplicates = duplicateEmails.find(inputText),
			indexByDuplicateCount = duplicateEmails.getIndexByCountDesc(duplicates),
			indexByName = duplicateEmails.getIndexByName(duplicates),
			duplicateCount = 0,
			uniqueCount = 0,
			maxFieldCount = getFieldCount(duplicates);
		renderDuplicates(duplicates, indexByDuplicateCount, maxFieldCount, $('#duplicate-output'), function matchDuplicateOnly(duplicate) {
			if (duplicate.length > 1) {
				duplicateCount++;
				return true;
			}
			return false;
		});
		renderDuplicates(duplicates, indexByName, maxFieldCount, $('#unique-output'), function matchUniqueOnly(duplicate) {
			if (duplicate.length == 1) {
				uniqueCount++;
				return true;
			}
			return false;
		});
		$('#duplicate-count').text(duplicateCount);
		$('#unique-count').text(uniqueCount);
	});

	function getFieldCount(duplicates) {
		var duplicateAddresses = Object.keys(duplicates),
			fieldCount,
			maxFieldCount = 0,
			duplicate,
			duplicateIndex,
			entry,
			entryIndex;

		for (duplicateIndex = 0; duplicateIndex < duplicateAddresses.length; duplicateIndex++) {
			duplicate = duplicates[duplicateAddresses[duplicateIndex]];
			for (entryIndex = 0; entryIndex < duplicate.length; entryIndex++) {
				entry = duplicate[entryIndex];
				fieldCount = entry.fields.length + 1; // address
				if (fieldCount > maxFieldCount) {
					maxFieldCount = fieldCount;
				}
			}
		}
		return maxFieldCount;
	}

	function getIds(duplicate) {
		var ids = [],
			i;
		for (i = 0; i < duplicate.length; i++) {
			ids.push(duplicate[i].fields[0]);
		}
		return ids;
	}

	function renderDuplicates(duplicates, addressIndex, maxFieldCount, $output, matcher) {
		$output.empty();
		var $duplicates = $('<table></table>'),
			address,
			i;

		for (i = 0; i < addressIndex.length; i++) {
			address = addressIndex[i];
			if (matcher(duplicates[address])) {
				$duplicates.append(renderDuplicate(address, duplicates[address], maxFieldCount));
			}
		}
		$output.append($duplicates);
	}

	function renderDuplicate(address, duplicate, maxFieldCount) {
		var $duplicate = $('<tbody></tbody>'),
			$duplicateRow = $('<tr></tr>'),
			$duplicateItem = $('<th colspan="' + (maxFieldCount + 1) + '"></th>'),
			$duplicateIdRow = $('<tr></tr>'),
			$duplicateIds = $('<td colspan="' + (maxFieldCount + 1) + '"></td>'),
			$separator = $('<tr><td colspan="' + (maxFieldCount + 1) + '">&nbsp;</td></tr>'),
			i;

		if (duplicate.length == 1) {
			$duplicate.append(renderDuplicateEntries(duplicate[0]));
		} else {
			$duplicateItem.text(address + ' (' + duplicate.length + ')');
			$duplicateRow.append($duplicateItem);
			$duplicate.append($duplicateRow);
			$duplicateIds.text('ID: ' + getIds(duplicate).join(', '));
			$duplicateIdRow.append($duplicateIds);
			$duplicate.append($duplicateIdRow);
			for (i = 0; i < duplicate.length; i++) {
				$duplicate.append(renderDuplicateEntries(duplicate[i]));
			}
			$duplicate.append($separator);
		}
		return $duplicate;
	}

	function renderDuplicateEntries(duplicateEntries) {
		var $duplicateEntry = $('<tr></tr>'),
			$rowHeaderCell = $('<td>-</td>'),
			$addressCell = $('<td></td>'),
			$fieldCell,
			field,
			i;

		$duplicateEntry.append($rowHeaderCell);
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