<?php
defined('TYPO3_MODE') || die();

call_user_func(
    function()
    {

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SfSeolighthouse',
            'Showlighthouse',
            [
                \Stackfactory\SfSeolighthouse\Controller\LighthouseStatisticsController::class => 'list, show,  analyse, new, create, delete'
            ],
            // non-cacheable actions
            [
                \Stackfactory\SfSeolighthouse\Controller\LighthouseStatisticsController::class => 'delete'
            ]
        );

        // wizards
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
            'mod {
                wizards.newContentElement.wizardItems.plugins {
                    elements {
                        showlighthouse {
                            iconIdentifier = sf_seolighthouse-plugin-showlighthouse
                            title = LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sf_seolighthouse_showlighthouse.name
                            description = LLL:EXT:sf_seolighthouse/Resources/Private/Language/locallang_db.xlf:tx_sf_seolighthouse_showlighthouse.description
                            tt_content_defValues {
                                CType = list
                                list_type = sfseolighthouse_showlighthouse
                            }
                        }
                    }
                    show = *
                }
           }'
        );
		$iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
		
			$iconRegistry->registerIcon(
				'sf_seolighthouse-plugin-showlighthouse',
				\TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
				['source' => 'EXT:sf_seolighthouse/Resources/Public/Icons/user_plugin_showlighthouse.svg']
			);
		
    }
);