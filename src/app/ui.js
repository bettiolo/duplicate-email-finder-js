$(function () {
	'use strict';

	$('#parse-data').click(function () {
		findDuplicates($('#source-data').text(), $('#output'));
	});

	function findDuplicates(inputText, $output) {
		var duplicates = duplicateEmails.find(inputText),
			duplicateAddresses = Object.keys(duplicates),
			$duplicatesList = $('<ul></ul>'),
			address,
			i;

		for (i = 0; i < duplicateAddresses.length; i++) {
			address = duplicateAddresses[i];
			$duplicatesList.append(getDuplicateOutputElement(address, duplicates[address]));
		}

		$output.append($duplicatesList);
	}

	function getDuplicateOutputElement(address, duplicate) {
		var $duplicateListItem = $('<li></li>'),
			$duplicateEntries = $('<table></table>'),
			$duplicateEntry,
			$addressCell,
			i;
		$duplicateListItem.text(address);
		if (duplicate) {
			for (i = 0; i < duplicate.length; i++) {
				$duplicateEntry = $('<tr></tr>');
				$addressCell = $('<td></td>');
				$addressCell.text(duplicate[i].address.value);
				$duplicateEntry.append($addressCell);
				$duplicateEntries.append($duplicateEntry);
			}
		}
		$duplicateListItem.append($duplicateEntries);
		return $duplicateListItem;
	}

});